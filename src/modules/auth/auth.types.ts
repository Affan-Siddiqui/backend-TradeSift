// auth.types.ts

export interface PendingRegistrationData {
  firstName: string;
  lastName: string;
  organisation?: string;
  email: string;
  hashedPassword: string;
  otp: string;
  otpGeneratedAt: string;   // ISO timestamp
  otpExpiresAt: string;     // ISO timestamp
  verificationAttempts: number;
}