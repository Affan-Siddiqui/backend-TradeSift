import { Router } from 'express';
import { login, register, resendLoginOtpHandler, resendOtpHandler, verifyLoginOtpHandler, verifyOtpHandler } from './auth.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { loginResendOtpSchema, loginSchema, loginVerifyOtpSchema, registerSchema, resendOtpSchema, verifyOtpSchema } from './auth.schema.js';

const router = Router();

// Register routes
router.post('/register', validate(registerSchema), register);
router.post('/register/resend-otp', validate(resendOtpSchema), resendOtpHandler);
router.post('/register/verify-otp', validate(verifyOtpSchema), verifyOtpHandler);

// Login routes
router.post('/login', validate(loginSchema), login);
router.post('/login/resend-otp', validate(loginResendOtpSchema), resendLoginOtpHandler);
router.post('/login/verify-otp', validate(loginVerifyOtpSchema), verifyLoginOtpHandler);

export default router;