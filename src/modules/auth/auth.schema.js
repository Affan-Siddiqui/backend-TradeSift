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
export const verifyOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    otp: z
        .string()
        .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
        .regex(/^\d+$/, 'OTP must be numeric'),
});
export const resendOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
});
// ---------- Login ----------
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberDevice: z.boolean().default(false),
});
export const loginVerifyOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    otp: z
        .string()
        .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
        .regex(/^\d+$/, 'OTP must be numeric'),
});
export const loginResendOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
});
// ---------- Change Password ----------
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required').optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPasswordConfirmation: z.string(),
}).refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirmation'],
});
// ---------- Forgot Password ----------
export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
});
export const forgotPasswordVerifyOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    otp: z.string()
        .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
        .regex(/^\d+$/, 'OTP must be numeric'),
});
export const forgotPasswordResendOtpSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
});
export const resetPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPasswordConfirmation: z.string(),
}).refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirmation'],
});
//# sourceMappingURL=auth.schema.js.map