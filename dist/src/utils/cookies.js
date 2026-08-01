import { env } from '../config/env.js';
const isProd = env.NODE_ENV === 'production';
const COOKIE_NAMES = {
    ACCESS: 'access_token',
    REFRESH: 'refresh_token',
    TRUSTED_DEVICE: 'trusted_device_id',
};
const baseCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
};
export const setAccessTokenCookie = (res, token) => {
    res.cookie(COOKIE_NAMES.ACCESS, token, { ...baseCookieOptions, maxAge: 30 * 60 * 1000 });
};
export const setRefreshTokenCookie = (res, token) => {
    res.cookie(COOKIE_NAMES.REFRESH, token, { ...baseCookieOptions, maxAge: 2 * 24 * 60 * 60 * 1000 });
};
export const setTrustedDeviceCookie = (res, id) => {
    res.cookie(COOKIE_NAMES.TRUSTED_DEVICE, id, { ...baseCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
};
export const clearAuthCookies = (res) => {
    res.clearCookie(COOKIE_NAMES.ACCESS);
    res.clearCookie(COOKIE_NAMES.REFRESH);
};
//# sourceMappingURL=cookies.js.map