// auth.schema.ts
import { z } from 'zod';
import { OTP_LENGTH } from './auth.constants.js';


// ---------- Register ----------
export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    organisation: z.string().trim().optional(),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    passwordConfirmation: z.string(),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  otp: z
    .string()
    .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
    .regex(/^\d+$/, 'OTP must be numeric'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export type ResendOtpInput = z.infer<typeof resendOtpSchema>;



// ---------- Login ----------

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberDevice: z.boolean().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const loginVerifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  otp: z
    .string()
    .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
    .regex(/^\d+$/, 'OTP must be numeric'),
});
export type LoginVerifyOtpInput = z.infer<typeof loginVerifyOtpSchema>;

export const loginResendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});
export type LoginResendOtpInput = z.infer<typeof loginResendOtpSchema>;


// ---------- Change Password ----------
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPasswordConfirmation: z.string(),
}).refine((data) => data.newPassword === data.newPasswordConfirmation, {
  message: 'Passwords do not match',
  path: ['newPasswordConfirmation'],
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;


// ---------- Forgot Password ----------
export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordVerifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  otp: z.string()
    .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
    .regex(/^\d+$/, 'OTP must be numeric'),
});
export type ForgotPasswordVerifyOtpInput = z.infer<typeof forgotPasswordVerifyOtpSchema>;

export const forgotPasswordResendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});
export type ForgotPasswordResendOtpInput = z.infer<typeof forgotPasswordResendOtpSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPasswordConfirmation: z.string(),
}).refine((data) => data.newPassword === data.newPasswordConfirmation, {
  message: 'Passwords do not match',
  path: ['newPasswordConfirmation'],
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;