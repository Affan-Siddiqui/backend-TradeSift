import { Router } from 'express';
import { changePassword, forgotPassword, googleAuthCallback, googleAuthRedirect, login, logout, refreshToken, register, resendForgotPasswordOtpHandler, resendLoginOtpHandler, resendOtpHandler, resetPasswordHandler, verifyForgotPasswordOtpHandler, verifyLoginOtpHandler, verifyOtpHandler } from './auth.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { changePasswordSchema, forgotPasswordResendOtpSchema, forgotPasswordSchema, forgotPasswordVerifyOtpSchema, loginResendOtpSchema, loginSchema, loginVerifyOtpSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema } from './auth.schema.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
const router = Router();
// Register routes
router.post('/register', validate(registerSchema), register);
router.post('/register/resend-otp', validate(resendOtpSchema), resendOtpHandler);
router.post('/register/verify-otp', validate(verifyOtpSchema), verifyOtpHandler);
// Login routes
router.post('/login', validate(loginSchema), login);
router.post('/login/resend-otp', validate(loginResendOtpSchema), resendLoginOtpHandler);
router.post('/login/verify-otp', validate(loginVerifyOtpSchema), verifyLoginOtpHandler);
// Google OAuth routes
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);
// Logout route
router.post('/logout', logout);
// Change password route
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);
// Forgot password routes
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/forgot-password/resend-otp', validate(forgotPasswordResendOtpSchema), resendForgotPasswordOtpHandler);
router.post('/forgot-password/verify-otp', validate(forgotPasswordVerifyOtpSchema), verifyForgotPasswordOtpHandler);
router.post('/forgot-password/reset-password', validate(resetPasswordSchema), resetPasswordHandler);
// Refresh token route
router.post('/refresh', refreshToken);
export default router;
//# sourceMappingURL=auth.routes.js.map