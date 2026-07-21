import type { Response } from 'express';
import { env } from '../config/env.js';

const isProd = env.NODE_ENV === 'production';

const COOKIE_NAMES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  TRUSTED_DEVICE: 'trusted_device_id',
} as const;

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
};

export const setAccessTokenCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAMES.ACCESS, token, { ...baseCookieOptions, maxAge: 30 * 60 * 1000 });
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAMES.REFRESH, token, { ...baseCookieOptions, maxAge: 2 * 24 * 60 * 60 * 1000 });
};

export const setTrustedDeviceCookie = (res: Response, id: string): void => {
  res.cookie(COOKIE_NAMES.TRUSTED_DEVICE, id, { ...baseCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie(COOKIE_NAMES.ACCESS);
  res.clearCookie(COOKIE_NAMES.REFRESH);  
};