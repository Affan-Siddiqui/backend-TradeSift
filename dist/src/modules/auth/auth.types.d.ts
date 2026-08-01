export interface PendingRegistrationData {
    firstName: string;
    lastName: string;
    organisation?: string;
    email: string;
    hashedPassword: string;
    agreedToTerms: boolean;
    otp: string;
    otpGeneratedAt: string;
    otpExpiresAt: string;
    verificationAttempts: number;
}
export interface PendingLoginData {
    userId: string;
    email: string;
    otp: string;
    otpGeneratedAt: string;
    otpExpiresAt: string;
    verificationAttempts: number;
    rememberDevice: boolean;
}
export interface PendingPasswordResetData {
    userId: string;
    email: string;
    otp: string;
    otpGeneratedAt: string;
    otpExpiresAt: string;
    verificationAttempts: number;
    verified: boolean;
}
//# sourceMappingURL=auth.types.d.ts.map