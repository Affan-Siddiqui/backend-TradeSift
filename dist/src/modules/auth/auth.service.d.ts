import type { RegisterInput, VerifyOtpInput, ResendOtpInput, LoginInput, LoginResendOtpInput, LoginVerifyOtpInput, ChangePasswordInput, ForgotPasswordInput, ForgotPasswordVerifyOtpInput, ForgotPasswordResendOtpInput, ResetPasswordInput } from './auth.schema.js';
export declare const registerUser: (input: RegisterInput) => Promise<{
    email: string;
}>;
export declare const resendOtp: (input: ResendOtpInput) => Promise<{
    email: string;
}>;
export declare const verifyOtp: (input: VerifyOtpInput) => Promise<{
    trustedDeviceToken: string;
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
}>;
export declare const loginUser: (input: LoginInput, trustedDeviceCookie?: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    requiresOtp: false;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        organisation: string | null;
    };
    email?: never;
} | {
    requiresOtp: true;
    email: string;
}>;
export declare const resendLoginOtp: (input: LoginResendOtpInput) => Promise<{
    email: string;
}>;
export declare const verifyLoginOtp: (input: LoginVerifyOtpInput) => Promise<{
    trustedDeviceToken: string | undefined;
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
    };
}>;
export declare const getGoogleAuthUrl: () => string;
export declare const handleGoogleCallback: (code: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        organisation: string | null;
    };
}>;
export declare const logoutUser: (refreshTokenCookie?: string) => Promise<void>;
export declare const changeUserPassword: (userId: string, input: ChangePasswordInput) => Promise<void>;
export declare const forgotPasswordRequest: (input: ForgotPasswordInput) => Promise<void>;
export declare const resendForgotPasswordOtp: (input: ForgotPasswordResendOtpInput) => Promise<void>;
export declare const verifyForgotPasswordOtp: (input: ForgotPasswordVerifyOtpInput) => Promise<void>;
export declare const resetPassword: (input: ResetPasswordInput) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map