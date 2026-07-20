import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/ApiResponse.js';
import { registerUser, resendOtp, verifyOtp } from './auth.service.js';
import type { RegisterInput, ResendOtpInput, VerifyOtpInput } from './auth.schema.js';

export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(new ApiResponse('OTP sent to your email.', result));
  } catch (err) {
    next(err);
  }
};

export const resendOtpHandler = async (
  req: Request<unknown, unknown, ResendOtpInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await resendOtp(req.body);
    res.status(200).json(new ApiResponse('OTP resent to your email.', result));
  } catch (err) {
    next(err);
  }
};

export const verifyOtpHandler = async (
  req: Request<unknown, unknown, VerifyOtpInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await verifyOtp(req.body);
    res.status(201).json(new ApiResponse('Registration complete.', result));
  } catch (err) {
    next(err);
  }
};