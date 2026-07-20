// auth.constants.ts

// OTP
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes
export const OTP_RESEND_INTERVAL_SECONDS = 120; // 2 minutes
export const OTP_MAX_VERIFY_ATTEMPTS = 3;

// Pending registration (Redis)
export const PENDING_REGISTRATION_TTL_SECONDS = OTP_EXPIRY_SECONDS; // expires with OTP window
export const PENDING_REGISTRATION_KEY_PREFIX = 'pending_registration:';

// Abuse / Cooldown ladder (registration OTP generation)
export const MAX_OTP_GENERATIONS_BEFORE_COOLDOWN = 5;

// stage index -> cooldown duration in seconds
export const COOLDOWN_LADDER_SECONDS: Record<number, number> = {
  1: 30 * 60,        // 30 minutes
  2: 60 * 60,        // 1 hour
  3: 5 * 60 * 60,    // 5 hours
  4: 24 * 60 * 60,   // 24 hours
  // stage 5+ repeats at 24h — handled in service logic, not here
};
export const COOLDOWN_MAX_STAGE = 4; // beyond this, reuse 24h repeatedly