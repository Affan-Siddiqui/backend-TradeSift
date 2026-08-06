// auth.service.ts

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
  RESET_VERIFIED_TTL_SECONDS,
} from './auth.constants.js';
import {
  setPendingRegistration,
  getPendingRegistration,
  deletePendingRegistration,
  findUserByEmail,
  createUser,
  findCooldownRecord,
  upsertCooldownRecord,
  deletePendingLogin,
  getPendingLogin,
  setPendingLogin,
  findUserById,
  updateUserPassword,
  deletePendingPasswordReset,
  getPendingPasswordReset,
  setPendingPasswordReset,
} from './auth.repository.js';
import { 
  createSession,
  deleteSessionByRefreshTokenHash,
  deleteAllSessionsForUser,
  updateSessionRefreshToken,
  findSessionByRefreshTokenHash,
} from "../sessions/session.repository.js";
import { 
  countTrustedDevicesForUser,
  createTrustedDevice,
  deleteLeastRecentlyUsedTrustedDevice,
  updateTrustedDeviceLastUsed,
  deleteAllTrustedDevicesForUser,
  findTrustedDeviceByHash,
} from "../trusted-devices/trustedDevice.repository.js";
import type { RegisterInput, VerifyOtpInput, ResendOtpInput, LoginInput, LoginResendOtpInput, LoginVerifyOtpInput, ChangePasswordInput, ForgotPasswordInput, ForgotPasswordVerifyOtpInput, ForgotPasswordResendOtpInput, ResetPasswordInput } from './auth.schema.js';
import type { PendingLoginData, PendingPasswordResetData, PendingRegistrationData } from './auth.types.js';
import { CooldownType } from '@prisma/client';
import { signAccessToken, verifyRefreshToken } from '../../utils/jwt.js';
import { hashToken, generateRandomToken } from '../../utils/crypto.js';
import { googleClient } from '../../config/google.js';
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';
import { issueSessionAndTokens } from '../sessions/session.service.js';
import { MAX_TRUSTED_DEVICES } from '../trusted-devices/trustedDevice.constants.js';

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
  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TradeSift Verification</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #fafafa;
    color: #171717;
    margin: 0;
    padding: 40px 20px;
  }
  .container {
    max-width: 480px;
    margin: 0 auto;
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .logo {
    text-align: center;
    margin-bottom: 32px;
  }
  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #171717;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
    color: #171717;
  }
  .subtitle {
    font-size: 14px;
    color: #737373;
    text-align: center;
    margin-bottom: 32px;
    line-height: 1.5;
  }
  .otp-container {
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    margin-bottom: 32px;
  }
  .otp-code {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 8px;
    color: #171717;
    margin: 0;
  }
  .footer {
    font-size: 12px;
    color: #a3a3a3;
    text-align: center;
    margin-top: 32px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="logo">c
      <div class="logo-text">TradeSift</div>
    </div>
    <div class="title">Verify your identity</div>
    <div class="subtitle">
      You are receiving this email because a request was made to verify this email address. Please use the verification code below:
    </div>
    <div class="otp-container">
      <p class="otp-code">${otp}</p>
    </div>
    <div class="subtitle" style="margin-bottom: 0;">
      This code will expire in 5 minutes. If you didn't request this code, you can safely ignore this email.
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} TradeSift. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  await sendMail(
    email,
    'Your TradeSift Verification Code',
    htmlTemplate
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
    agreedToTerms: input.agreedToTerms,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
  };

  await setPendingRegistration(input.email, pendingData);
  await recordOtpGeneration(input.email, CooldownType.REGISTER);
  await sendOtpEmail(input.email, otp);
  logger.info({ email: input.email }, 'Registration OTP sent');

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
  logger.info({ email: input.email }, 'Registration OTP resent');

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
  logger.info({ userId: user.id, email: pending.email }, 'User registered');

  // --- Trusted-device creation (mirrors verifyLoginOtp) ---
  const deviceCount = await countTrustedDevicesForUser(user.id);
  if (deviceCount >= MAX_TRUSTED_DEVICES) {
    await deleteLeastRecentlyUsedTrustedDevice(user.id);
  }

  const rawTrustedDeviceToken = generateRandomToken();
  const device = await createTrustedDevice({
    userId: user.id,
    trustedDeviceIdHash: hashToken(rawTrustedDeviceToken),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const tokens = await issueSessionAndTokens(user.id, device.id);

  return {
    ...userWithoutPassword,
    ...tokens,
    trustedDeviceToken: rawTrustedDeviceToken,
  };
};


// ---------- Login ----------

export const loginUser = async (input: LoginInput, trustedDeviceCookie?: string) => {
  const user = await findUserByEmail(input.email);
  if (!user) throw new ApiError(401, 'Invalid credentials');

  if (!user.password) throw new ApiError(401, 'Invalid credentials');
  const passwordMatches = await comparePassword(input.password, user.password);
  if (!passwordMatches) throw new ApiError(401, 'Invalid credentials');

  if (trustedDeviceCookie) {
    const hash = hashToken(trustedDeviceCookie);
    const device = await findTrustedDeviceByHash(hash);

    if (device && device.userId === user.id && device.expiresAt > new Date()) {
      await updateTrustedDeviceLastUsed(device.id);
      const tokens = await issueSessionAndTokens(user.id, device.id);
      logger.info({ userId: user.id, trustedDeviceId: device.id }, 'Trusted device login');
      return {
        requiresOtp: false as const,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          organisation: user.organisation
        },
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
  logger.info({ userId: user.id, email: input.email }, 'Login OTP sent');

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


// ---------- Google Auth ----------
export const getGoogleAuthUrl = (): string => {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  });
};

export const handleGoogleCallback = async (code: string) => {
  const { tokens } = await googleClient.getToken(code);

  if (!tokens.id_token) {
    throw new ApiError(400, 'Google did not return an ID token.');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_OAUTH_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) {
    throw new ApiError(400, 'Invalid Google account payload.');
  }

  if (!payload.email_verified) {
    throw new ApiError(400, 'Google account email is not verified.');
  }

  const { email, given_name, family_name } = payload;

  let user = await findUserByEmail(email);

  if (!user) {
    // Brand new user
    user = await createUser({
      email,
      firstName: given_name ?? 'Google',
      lastName: family_name ?? 'User',
    });
  }

  // Google sign-in skips OTP/trusted-device flow entirely
  const sessionTokens = await issueSessionAndTokens(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation || null,
    },
    ...sessionTokens,
  };
};


// ---------- Logout ----------
export const logoutUser = async (refreshTokenCookie?: string): Promise<void> => {
  if (!refreshTokenCookie) return; // nothing to revoke, treat as already logged out

  const hash = hashToken(refreshTokenCookie);
  await deleteSessionByRefreshTokenHash(hash);
};


// ---------- Change Password ----------
export const changeUserPassword = async (
  userId: string,
  input: ChangePasswordInput
): Promise<void> => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found.');

  if (user.password) {
    if (!input.currentPassword) throw new ApiError(401, 'current password needed')
    const currentPasswordValid = await comparePassword(input.currentPassword, user.password);
    if (!currentPasswordValid) throw new ApiError(401, 'Current password is incorrect.');
  }

  const newHashedPassword = await hashPassword(input.newPassword);

  await updateUserPassword(userId, newHashedPassword);
  await deleteAllSessionsForUser(userId);
  await deleteAllTrustedDevicesForUser(userId);
};


// ---------- Forgot Password ----------
export const forgotPasswordRequest = async (input: ForgotPasswordInput): Promise<void> => {
  const user = await findUserByEmail(input.email);
  if (!user) return; // silent no-op, generic response regardless

  const cooldownRecord = await findCooldownRecord(input.email, CooldownType.FORGOT_PASSWORD);
  if (cooldownRecord?.cooldownUntil && cooldownRecord.cooldownUntil > new Date()) {
    return; // still silent — don't leak cooldown state either
  }

  const otp = generateOtp();
  const now = new Date();

  const pendingData: PendingPasswordResetData = {
    userId: user.id,
    email: user.email,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
    verified: false,
  };

  await setPendingPasswordReset(input.email, pendingData);
  await recordOtpGeneration(input.email, CooldownType.FORGOT_PASSWORD);
  await sendOtpEmail(input.email, otp);
};


export const resendForgotPasswordOtp = async (input: ForgotPasswordResendOtpInput): Promise<void> => {
  const pending = await getPendingPasswordReset(input.email);
  if (!pending) {
    throw new ApiError(400, 'Reset session expired. Please start again.');
  }

  const secondsSinceLastOtp = (Date.now() - new Date(pending.otpGeneratedAt).getTime()) / 1000;
  if (secondsSinceLastOtp < OTP_RESEND_INTERVAL_SECONDS) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }
  // return; // silent no-op, no 429 leak either

  const cooldownRecord = await findCooldownRecord(input.email, CooldownType.FORGOT_PASSWORD);
  if (cooldownRecord?.cooldownUntil && cooldownRecord.cooldownUntil > new Date()) return;

  const otp = generateOtp();
  const now = new Date();

  const updated: PendingPasswordResetData = {
    ...pending,
    otp,
    otpGeneratedAt: now.toISOString(),
    otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
    verificationAttempts: 0,
    verified: false,
  };

  await setPendingPasswordReset(input.email, updated);
  await recordOtpGeneration(input.email, CooldownType.FORGOT_PASSWORD);
  await sendOtpEmail(input.email, otp);
};

export const verifyForgotPasswordOtp = async (input: ForgotPasswordVerifyOtpInput): Promise<void> => {
  const pending = await getPendingPasswordReset(input.email);
  if (!pending) throw new ApiError(400, 'Reset session expired. Please start again.');

  if (new Date(pending.otpExpiresAt) < new Date()) {
    await deletePendingPasswordReset(input.email);
    throw new ApiError(400, 'OTP expired. Please start again.');
  }

  if (pending.otp !== input.otp) {
    const attempts = pending.verificationAttempts + 1;
    if (attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
      await deletePendingPasswordReset(input.email);
      throw new ApiError(400, 'Too many incorrect attempts. Please start again.');
    }
    await setPendingPasswordReset(input.email, { ...pending, verificationAttempts: attempts });
    throw new ApiError(400, 'Incorrect OTP.');
  }

  const verified: PendingPasswordResetData = { ...pending, verified: true };
  await setPendingPasswordReset(input.email, verified, RESET_VERIFIED_TTL_SECONDS);
};

export const resetPassword = async (input: ResetPasswordInput): Promise<void> => {
  const pending = await getPendingPasswordReset(input.email);
  if (!pending || !pending.verified) {
    throw new ApiError(400, 'OTP verification required before resetting password.');
  }

  const newHashedPassword = await hashPassword(input.newPassword);

  await updateUserPassword(pending.userId, newHashedPassword);
  await deleteAllSessionsForUser(pending.userId);
  await deleteAllTrustedDevicesForUser(pending.userId);
  await deletePendingPasswordReset(input.email);
};


