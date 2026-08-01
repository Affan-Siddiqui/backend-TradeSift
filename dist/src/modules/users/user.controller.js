import { ApiResponse } from '../../common/ApiResponse.js';
import { getUserProfile, updateUserProfile, deleteUserAccount, getAllUsersList, deleteAllUsersData, } from './user.service.js';
import { ApiError } from '../../common/ApiError.js';
export const getMe = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const user = await getUserProfile(req.userId);
        res.status(200).json(new ApiResponse('Profile fetched.', user));
    }
    catch (err) {
        next(err);
    }
};
export const updateMe = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const user = await updateUserProfile(req.userId, req.body);
        res.status(200).json(new ApiResponse('Profile updated.', user));
    }
    catch (err) {
        next(err);
    }
};
export const deleteMe = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        await deleteUserAccount(req.userId);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.clearCookie('trusted_device_id');
        res.status(200).json(new ApiResponse('Account deleted.', null));
    }
    catch (err) {
        next(err);
    }
};
export const getAllUsers = async (_req, res, next) => {
    try {
        const users = await getAllUsersList();
        res.status(200).json(new ApiResponse('All users fetched.', users));
    }
    catch (err) {
        next(err);
    }
};
export const deleteAllUsers = async (_req, res, next) => {
    try {
        await deleteAllUsersData();
        res.status(200).json(new ApiResponse('All users deleted.', null));
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=user.controller.js.map