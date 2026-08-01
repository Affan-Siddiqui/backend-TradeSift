import { ApiError } from '../common/ApiError.js';
export const notFoundMiddleware = (req, _res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
//# sourceMappingURL=notFound.middleware.js.map