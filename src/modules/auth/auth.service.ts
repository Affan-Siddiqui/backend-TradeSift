
import { hashPassword } from '../../utils/hash.js';
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
} from './auth.repository.js';
import type { RegisterInput, VerifyOtpInput, ResendOtpInput } from './auth.schema.js';
import type { PendingRegistrationData } from './auth.types.js';

// ---------- Helpers ----------

const checkCooldown = async (email: string): Promise<void> => {
  const record = await findCooldownRecord(email);
  if (record?.cooldownUntil && record.cooldownUntil > new Date()) {
    throw new ApiError(429, 'Too many OTP requests. Please try again later.');
  }
};

const recordOtpGeneration = async (email: string): Promise<void> => {
  const record = await findCooldownRecord(email);
  const nextCount = (record?.generationCount ?? 0) + 1;

  let cooldownStage = record?.cooldownStage ?? 0;
  let cooldownUntil: Date | null = null;

  if (nextCount >= MAX_OTP_GENERATIONS_BEFORE_COOLDOWN) {
    cooldownStage = Math.min(cooldownStage + 1, COOLDOWN_MAX_STAGE);
    const seconds = COOLDOWN_LADDER_SECONDS[cooldownStage] ?? COOLDOWN_LADDER_SECONDS[COOLDOWN_MAX_STAGE]!;
    cooldownUntil = new Date(Date.now() + seconds * 1000);
  }

  await upsertCooldownRecord(email, {
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

  await checkCooldown(input.email);

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
  await recordOtpGeneration(input.email);
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

  await checkCooldown(input.email);

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
  await recordOtpGeneration(input.email);
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