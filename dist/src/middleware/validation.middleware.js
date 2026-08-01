import { ApiError } from '../common/ApiError.js';
import logger from '../config/logger.js';
export const validate = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const firstIssue = result.error.issues[0];
            const message = firstIssue ? firstIssue.message : 'Invalid request data';
            logger.warn({ method: req.method, path: req.path, issues: result.error.issues.map((issue) => issue.message) }, 'Request validation failed');
            return next(new ApiError(400, message));
        }
        req.body = result.data;
        next();
    };
};
export const validateQuery = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            const firstIssue = result.error.issues[0];
            const message = firstIssue ? firstIssue.message : 'Invalid query parameters';
            logger.warn({ method: req.method, path: req.path, issues: result.error.issues.map((issue) => issue.message) }, 'Query validation failed');
            return next(new ApiError(400, message));
        }
        Object.defineProperty(req, 'query', {
            value: result.data,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        next();
    };
};
export const validateParams = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            const firstIssue = result.error.issues[0];
            const message = firstIssue ? firstIssue.message : 'Invalid URL parameters';
            logger.warn({ method: req.method, path: req.path, issues: result.error.issues.map((issue) => issue.message) }, 'Params validation failed');
            return next(new ApiError(400, message));
        }
        Object.defineProperty(req, 'params', {
            value: result.data,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        next();
    };
};
//# sourceMappingURL=validation.middleware.js.map