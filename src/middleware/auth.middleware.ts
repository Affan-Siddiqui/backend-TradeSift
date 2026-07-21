import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../common/ApiError.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token as string | undefined;

  if (!token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired session.'));
  }
};