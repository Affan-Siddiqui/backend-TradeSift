import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    organisation: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
    passwordConfirmation: z.ZodString;
    agreedToTerms: z.ZodBoolean;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export declare const verifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export declare const resendOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberDevice: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const loginVerifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export type LoginVerifyOtpInput = z.infer<typeof loginVerifyOtpSchema>;
export declare const loginResendOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type LoginResendOtpInput = z.infer<typeof loginResendOtpSchema>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodOptional<z.ZodString>;
    newPassword: z.ZodString;
    newPasswordConfirmation: z.ZodString;
}, z.core.$strip>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export declare const forgotPasswordVerifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordVerifyOtpInput = z.infer<typeof forgotPasswordVerifyOtpSchema>;
export declare const forgotPasswordResendOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordResendOtpInput = z.infer<typeof forgotPasswordResendOtpSchema>;
export declare const resetPasswordSchema: z.ZodObject<{
    email: z.ZodString;
    newPassword: z.ZodString;
    newPasswordConfirmation: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
//# sourceMappingURL=auth.schema.d.ts.map