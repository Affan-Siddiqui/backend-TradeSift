import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../common/ApiError.js';
export const requireAuth = (req, _res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return next(new ApiError(401, 'Authentication required.'));
    }
    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;
        next();
    }
    catch {
        next(new ApiError(401, 'Invalid or expired session.'));
    }
};
//# sourceMappingURL=auth.middleware.js.map