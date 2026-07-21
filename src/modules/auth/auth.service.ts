
import { comparePassword, hashPassword } from '../../utils/hash.js';
import { generateOtp } from '../../utils/otp.js';
import { sendMail } from '../../config/mail.js';
import { ApiError } from '../../common/ApiError.js';
import {
  OTP_EXPIRY_SECONDS,
  OTP_RESEND_INTERVAL_SECONDS,
  OTP_MAX_VERIFY_ATTEMPTS,
  MAX_OTP_GENERATIONS_BEFORE_COOLDOWN,
  COOLDOWN_LADDER_SECONDS,
  COOLDOWN_MAX_STAGE,
} from './auth.constants.js';
import {
  setPendingRegistration,
  getPendingRegistration,
  deletePendingRegistration,
  findUserByEmail,
  createUser,
  findCooldownRecord,
  upsertCooldownRecord,
  countTrustedDevicesForUser,
  createTrustedDevice,
  deleteLeastRecentlyUsedTrustedDevice,
  deletePendingLogin,
  findTrustedDeviceByHash,
  getPendingLogin,
  setPendingLogin,
  updateTrustedDeviceLastUsed,
  createSession,
} from './auth.repository.js';
import type { RegisterInput, VerifyOtpInput, ResendOtpInput, LoginInput, LoginResendOtpInput, LoginVerifyOtpInput } from './auth.schema.js';
import type { PendingLoginData, PendingRegistrationData } from './auth.types.js';
import { CooldownType } from '@prisma/client';
import { signAccessToken } from '../../utils/jwt.js';
import { hashToken, generateRandomToken } from '../../utils/crypto.js';

// ---------- Helpers ----------

const checkCooldown = async (email: string, type: CooldownType): Promise<void> => {
  const record = await findCooldownRecord(email, type);
  if (record?.cooldownUntil && record.cooldownUntil > new Date()) {
    throw new ApiError(429, 'Too many OTP requests. Please try again later.');
  }
};

const recordOtpGeneration = async (email: string, type: CooldownType): Promise<void> => {
  const record = await findCooldownRecord(email, type);
  const nextCount = (record?.generationCount ?? 0) + 1;

  let cooldownStage = record?.cooldownStage ?? 0;
  let cooldownUntil: Date | null = null;

  if (nextCount >= MAX_OTP_GENERATIONS_BEFORE_COOLDOWN) {
    cooldownStage = Math.min(cooldownStage + 1, COOLDOWN_MAX_STAGE);
    const seconds = COOLDOWN_LADDER_SECONDS[cooldownStage] ?? COOLDOWN_LADDER_SECONDS[COOLDOWN_MAX_STAGE]!;
    cooldownUntil = new Date(Date.now() + seconds * 1000);
  }

  await upsertCooldownRecord(email, type, {
    generationCount: nextCount >= MAX_OTP_GENERATIONS_BEFORE_COOLDOWN ? 0 : nextCount,
    lastGeneratedAt: new Date(),
    cooldownStage,
    cooldownUntil,
  });
};

const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  await sendMail(
    email,
    'Your TradeSift verification code',
    `<p>Your verification code is <b>${otp}</b>. It expires in 5 minutes.</p>`
  );
};

// ---------- Register ----------

export const registerUser = async (input: RegisterInput): Promise<{ email: string }> => {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  await checkCooldown(input.email, CooldownType.REGISTER);

  const hashedPassword = await hashPassword(input.password);
  const otp = generateOtp();
  const now = new Date();

  const pendingData: PendingRegistrationData = {
    firstName: input.firstName,
    lastName: input.lastName,
      ...(input.organisation !== undefined && { organisation: input.organisation }),
    email: input.email,
    hashedPassword,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
  };

  await setPendingRegistration(input.email, pendingData);
  await recordOtpGeneration(input.email, CooldownType.REGISTER);
  await sendOtpEmail(input.email, otp);

  return { email: input.email };
};

// ---------- Resend OTP ----------

export const resendOtp = async (input: ResendOtpInput): Promise<{ email: string }> => {
  const pending = await getPendingRegistration(input.email);
  if (!pending) {
    throw new ApiError(400, 'Registration session expired. Please register again.');
  }

  const secondsSinceLastOtp = (Date.now() - new Date(pending.otpGeneratedAt).getTime()) / 1000;
  if (secondsSinceLastOtp < OTP_RESEND_INTERVAL_SECONDS) {
    throw new ApiError(429, 'Please wait before requesting another OTP.');
  }

  await checkCooldown(input.email, CooldownType.REGISTER);

  const otp = generateOtp();
  const now = new Date();

  const updated: PendingRegistrationData = {
    ...pending,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
  };

  await setPendingRegistration(input.email, updated);
  await recordOtpGeneration(input.email, CooldownType.REGISTER);
  await sendOtpEmail(input.email, otp);

  return { email: input.email };
};

// ---------- Verify OTP ----------

export const verifyOtp = async (input: VerifyOtpInput) => {
  const pending = await getPendingRegistration(input.email);
  if (!pending) {
    throw new ApiError(400, 'Registration session expired. Please register again.');
  }

  if (new Date(pending.otpExpiresAt) < new Date()) {
    await deletePendingRegistration(input.email);
    throw new ApiError(400, 'OTP expired. Please request a new one.');
  }

  if (pending.otp !== input.otp) {
    const attempts = pending.verificationAttempts + 1;

    if (attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
      throw new ApiError(400, 'Too many incorrect attempts. Please request a new OTP.');
    }

    await setPendingRegistration(input.email, { ...pending, verificationAttempts: attempts });
    throw new ApiError(400, 'Incorrect OTP.');
  }

  const user = await createUser({
    firstName: pending.firstName,
    lastName: pending.lastName,
    organisation: pending.organisation ?? null,
    email: pending.email,
    password: pending.hashedPassword,
  });

  const { password, ...userWithoutPassword } = user;

  await deletePendingRegistration(input.email);

  return userWithoutPassword;
};





// ---------- Login ----------

const MAX_TRUSTED_DEVICES = 5;

const issueSessionAndTokens = async (userId: string, trustedDeviceId?: string) => {
  const accessToken = signAccessToken({ userId });
  const rawRefreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(rawRefreshToken);

  await createSession({
    userId,
    refreshTokenHash,
    trustedDeviceId: trustedDeviceId ?? null,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: rawRefreshToken };
};

export const loginUser = async (input: LoginInput, trustedDeviceCookie?: string) => {
  const user = await findUserByEmail(input.email);
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const passwordMatches = await comparePassword(input.password, user.password);
  if (!passwordMatches) throw new ApiError(401, 'Invalid credentials');

  if (trustedDeviceCookie) {
    const hash = hashToken(trustedDeviceCookie);
    const device = await findTrustedDeviceByHash(hash);

    if (device && device.userId === user.id && device.expiresAt > new Date()) {
      await updateTrustedDeviceLastUsed(device.id);
      const tokens = await issueSessionAndTokens(user.id, device.id);
      return {
        requiresOtp: false as const,
        user: { id: user.id, email: user.email },
        ...tokens,
      };
    }
  }

  // Untrusted path
  await checkCooldown(input.email, CooldownType.LOGIN);

  const otp = generateOtp();
  const now = new Date();

  const pendingData: PendingLoginData = {
    userId: user.id,
    email: user.email,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
    rememberDevice: input.rememberDevice,
  };

  await setPendingLogin(input.email, pendingData);
  await recordOtpGeneration(input.email, CooldownType.LOGIN);
  await sendOtpEmail(input.email, otp);

  return { requiresOtp: true as const, email: input.email };
};

export const resendLoginOtp = async (input: LoginResendOtpInput) => {
  const pending = await getPendingLogin(input.email);
  if (!pending) throw new ApiError(400, 'Login session expired. Please log in again.');

  const secondsSinceLastOtp = (Date.now() - new Date(pending.otpGeneratedAt).getTime()) / 1000;
  if (secondsSinceLastOtp < OTP_RESEND_INTERVAL_SECONDS) {
    throw new ApiError(429, 'Please wait before requesting another OTP.');
  }

  await checkCooldown(input.email, CooldownType.LOGIN);

  const otp = generateOtp();
  const now = new Date();

  const updated: PendingLoginData = {
    ...pending,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
  };

  await setPendingLogin(input.email, updated);
  await recordOtpGeneration(input.email, CooldownType.LOGIN);
  await sendOtpEmail(input.email, otp);

  return { email: input.email };
};

export const verifyLoginOtp = async (input: LoginVerifyOtpInput) => {
  const pending = await getPendingLogin(input.email);
  if (!pending) throw new ApiError(400, 'Login session expired. Please log in again.');

  if (new Date(pending.otpExpiresAt) < new Date()) {
    await deletePendingLogin(input.email);
    throw new ApiError(400, 'OTP expired. Please log in again.');
  }

  if (pending.otp !== input.otp) {
    const attempts = pending.verificationAttempts + 1;
    if (attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
      await deletePendingLogin(input.email);
      throw new ApiError(400, 'Too many incorrect attempts. Please log in again.');
    }
    await setPendingLogin(input.email, { ...pending, verificationAttempts: attempts });
    throw new ApiError(400, 'Incorrect OTP.');
  }

  let trustedDeviceId: string | undefined;
  let rawTrustedDeviceToken: string | undefined;

  if (pending.rememberDevice) {
    const deviceCount = await countTrustedDevicesForUser(pending.userId);
    if (deviceCount >= MAX_TRUSTED_DEVICES) {
      await deleteLeastRecentlyUsedTrustedDevice(pending.userId);
    }
    rawTrustedDeviceToken = generateRandomToken();
    const device = await createTrustedDevice({
      userId: pending.userId,
      trustedDeviceIdHash: hashToken(rawTrustedDeviceToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    trustedDeviceId = device.id;
  }

  await deletePendingLogin(input.email);

  const tokens = await issueSessionAndTokens(pending.userId, trustedDeviceId);

  return {
    user: { id: pending.userId, email: pending.email },
    ...tokens,
    trustedDeviceToken: rawTrustedDeviceToken, // undefined if rememberDevice was false
  };
};