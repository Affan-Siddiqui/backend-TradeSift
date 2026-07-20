import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/ApiError.js';

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};