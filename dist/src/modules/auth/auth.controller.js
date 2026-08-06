import { ApiResponse } from '../../common/ApiResponse.js';
import { loginUser, resendLoginOtp, verifyLoginOtp, registerUser, resendOtp, verifyOtp, logoutUser, changeUserPassword, forgotPasswordRequest, resendForgotPasswordOtp, resetPassword, verifyForgotPasswordOtp, getGoogleAuthUrl, handleGoogleCallback } from './auth.service.js';
import { rotateRefreshToken } from '../sessions/session.service.js';
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie, setTrustedDeviceCookie } from '../../utils/cookies.js';
import { ApiError } from '../../common/ApiError.js';
import { env } from '../../config/env.js';
import { log } from 'node:console';
//--- register controller 
export const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(new ApiResponse('OTP sent to your email.', result));
    }
    catch (err) {
        next(err);
    }
};
export const resendOtpHandler = async (req, res, next) => {
    try {
        const result = await resendOtp(req.body);
        res.status(200).json(new ApiResponse('OTP resent to your email.', result));
    }
    catch (err) {
        next(err);
    }
};
export const verifyOtpHandler = async (req, res, next) => {
    try {
        const result = await verifyOtp(req.body);
        setAccessTokenCookie(res, result.accessToken);
        setRefreshTokenCookie(res, result.refreshToken);
        if (result.trustedDeviceToken) {
            setTrustedDeviceCookie(res, result.trustedDeviceToken);
        }
        res.status(201).json(new ApiResponse('Registration complete.', { user: result }));
    }
    catch (err) {
        next(err);
    }
};
//--- login controller
export const login = async (req, res, next) => {
    try {
        const trustedDeviceCookie = req.cookies?.trusted_device_id;
        const result = await loginUser(req.body, trustedDeviceCookie);
        if (!result.requiresOtp) {
            setAccessTokenCookie(res, result.accessToken);
            setRefreshTokenCookie(res, result.refreshToken);
            return res.status(200).json(new ApiResponse('Login successful.', { user: result.user }));
        }
        res.status(200).json(new ApiResponse('OTP sent to your email.', { email: result.email }));
    }
    catch (err) {
        next(err);
    }
};
export const resendLoginOtpHandler = async (req, res, next) => {
    try {
        const result = await resendLoginOtp(req.body);
        res.status(200).json(new ApiResponse('OTP resent to your email.', result));
    }
    catch (err) {
        next(err);
    }
};
export const verifyLoginOtpHandler = async (req, res, next) => {
    try {
        const result = await verifyLoginOtp(req.body);
        setAccessTokenCookie(res, result.accessToken);
        setRefreshTokenCookie(res, result.refreshToken);
        if (result.trustedDeviceToken) {
            setTrustedDeviceCookie(res, result.trustedDeviceToken);
        }
        res.status(200).json(new ApiResponse('Login successful.', { user: result.user }));
    }
    catch (err) {
        next(err);
    }
};
//----- GOOGLE_OAUTH
export const googleAuthRedirect = (req, res) => {
    const url = getGoogleAuthUrl();
    res.redirect(url);
};
export const googleAuthCallback = async (req, res, next) => {
    try {
        const code = req.query.code;
        const error = req.query.error;
        if (error) {
            // user denied consent on Google's screen
            return res.redirect(`${env.FRONTEND_URL}/login?error=${'google authentication was denied'}`);
            // throw new ApiError(400, `Google authentication failed: ${error}`);
        }
        if (!code) {
            throw new ApiError(400, 'Missing authorization code.');
        }
        const { user, accessToken, refreshToken } = await handleGoogleCallback(code);
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        // res.status(200).json(new ApiResponse('Login successful.', { user: user }));
        return res.redirect(`${env.FRONTEND_URL}/dashboard`);
    }
    catch (err) {
        if (err instanceof ApiError) {
            return res.redirect(`${env.FRONTEND_URL}/login?error=${err.message}`);
            // throw new ApiError(err.statusCode, `Google authentication failed: ${err.message}`);
        }
        next(err);
    }
};
// Logout controller
export const logout = async (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies?.refresh_token;
        await logoutUser(refreshTokenCookie);
        clearAuthCookies(res);
        res.status(200).json(new ApiResponse('Logged out successfully.', null));
    }
    catch (err) {
        next(err);
    }
};
// Change password controller
export const changePassword = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        await changeUserPassword(req.userId, req.body);
        clearAuthCookies(res);
        res.clearCookie('trusted_device_id');
        res.status(200).json(new ApiResponse('Password changed successfully. Please log in again.', null));
    }
    catch (err) {
        next(err);
    }
};
// Forgot password controllers
export const forgotPassword = async (req, res, next) => {
    try {
        await forgotPasswordRequest(req.body);
        res.status(200).json(new ApiResponse('If an account exists, a code has been sent.', null));
    }
    catch (err) {
        next(err);
    }
};
export const resendForgotPasswordOtpHandler = async (req, res, next) => {
    try {
        await resendForgotPasswordOtp(req.body);
        res.status(200).json(new ApiResponse('If an account exists, a new code has been sent.', null));
    }
    catch (err) {
        next(err);
    }
};
export const verifyForgotPasswordOtpHandler = async (req, res, next) => {
    try {
        await verifyForgotPasswordOtp(req.body);
        res.status(200).json(new ApiResponse('OTP verified. You may now set a new password.', null));
    }
    catch (err) {
        next(err);
    }
};
export const resetPasswordHandler = async (req, res, next) => {
    try {
        await resetPassword(req.body);
        res.status(200).json(new ApiResponse('Password reset successfully. Please log in.', null));
    }
    catch (err) {
        next(err);
    }
};
// Refresh token controller
export const refreshToken = async (req, res, next) => {
    try {
        log('Refresh token request received.');
        const refreshTokenCookie = req.cookies?.refresh_token;
        log('Refresh token from cookie:', refreshTokenCookie);
        if (!refreshTokenCookie)
            throw new ApiError(401, 'Authentication required.');
        const result = await rotateRefreshToken(refreshTokenCookie);
        setAccessTokenCookie(res, result.accessToken);
        setRefreshTokenCookie(res, result.refreshToken);
        res.status(200).json(new ApiResponse('Token refreshed.', null));
    }
    catch (err) {
        clearAuthCookies(res);
        next(err);
    }
};
//# sourceMappingURL=auth.controller.js.map