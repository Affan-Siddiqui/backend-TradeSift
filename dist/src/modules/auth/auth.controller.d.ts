import type { Request, Response, NextFunction } from 'express';
import type { ChangePasswordInput, ForgotPasswordInput, ForgotPasswordResendOtpInput, ForgotPasswordVerifyOtpInput, LoginInput, LoginResendOtpInput, LoginVerifyOtpInput, RegisterInput, ResendOtpInput, ResetPasswordInput, VerifyOtpInput } from './auth.schema.js';
export declare const register: (req: Request<unknown, unknown, RegisterInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const resendOtpHandler: (req: Request<unknown, unknown, ResendOtpInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyOtpHandler: (req: Request<unknown, unknown, VerifyOtpInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request<unknown, unknown, LoginInput>, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resendLoginOtpHandler: (req: Request<unknown, unknown, LoginResendOtpInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyLoginOtpHandler: (req: Request<unknown, unknown, LoginVerifyOtpInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const googleAuthRedirect: (req: Request, res: Response) => void;
export declare const googleAuthCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const changePassword: (req: Request<unknown, unknown, ChangePasswordInput> & {
    userId?: string;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const forgotPassword: (req: Request<unknown, unknown, ForgotPasswordInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const resendForgotPasswordOtpHandler: (req: Request<unknown, unknown, ForgotPasswordResendOtpInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyForgotPasswordOtpHandler: (req: Request<unknown, unknown, ForgotPasswordVerifyOtpInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const resetPasswordHandler: (req: Request<unknown, unknown, ResetPasswordInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map