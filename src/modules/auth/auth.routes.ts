import { Router } from 'express';
import { register, resendOtpHandler, verifyOtpHandler } from './auth.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { registerSchema, resendOtpSchema, verifyOtpSchema } from './auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/register/resend-otp', validate(resendOtpSchema), resendOtpHandler);
router.post('/register/verify-otp', validate(verifyOtpSchema), verifyOtpHandler);

export default router;