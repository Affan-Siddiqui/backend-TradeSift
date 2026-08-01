import logger from '../config/logger.js';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({ method: req.method, path: req.originalUrl, statusCode: res.statusCode, durationMs: duration }, 'request completed');
    });
    next();
};
//# sourceMappingURL=requestLogger.middleware.js.map