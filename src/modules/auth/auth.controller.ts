import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/ApiResponse.js';
import { loginUser, resendLoginOtp, verifyLoginOtp, registerUser, resendOtp, verifyOtp } from './auth.service.js';
import type { LoginInput, LoginResendOtpInput, LoginVerifyOtpInput, RegisterInput, ResendOtpInput, VerifyOtpInput } from './auth.schema.js';
import { setAccessTokenCookie, setRefreshTokenCookie, setTrustedDeviceCookie } from '../../utils/cookies.js';



//--- register controller 
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


//--- login controller
export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const trustedDeviceCookie = req.cookies?.trusted_device_id as string | undefined;
    const result = await loginUser(req.body, trustedDeviceCookie);

    if (!result.requiresOtp) {
      setAccessTokenCookie(res, result.accessToken);
      setRefreshTokenCookie(res, result.refreshToken);
      return res.status(200).json(new ApiResponse('Login successful.', { user: result.user }));
    }

    res.status(200).json(new ApiResponse('OTP sent to your email.', { email: result.email }));
  } catch (err) {
    next(err);
  }
};

export const resendLoginOtpHandler = async (
  req: Request<unknown, unknown, LoginResendOtpInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await resendLoginOtp(req.body);
    res.status(200).json(new ApiResponse('OTP resent to your email.', result));
  } catch (err) {
    next(err);
  }
};

export const verifyLoginOtpHandler = async (
  req: Request<unknown, unknown, LoginVerifyOtpInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await verifyLoginOtp(req.body);

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);
    if (result.trustedDeviceToken) {
      setTrustedDeviceCookie(res, result.trustedDeviceToken);
    }

    res.status(200).json(new ApiResponse('Login successful.', { user: result.user }));
  } catch (err) {
    next(err);
  }
};
