import { ApiError } from '../common/ApiError.js';
import logger from '../config/logger.js';
export const errorMiddleware = (err, _req, res, _next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    logger.error({ err }, 'Unexpected error');
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};
//# sourceMappingURL=error.middleware.js.map