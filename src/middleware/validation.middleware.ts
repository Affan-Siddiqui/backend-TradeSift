import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from '../common/ApiError.js';

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const message = firstIssue ? firstIssue.message : 'Invalid request data';
      return next(new ApiError(400, message));
    }

    req.body = result.data;
    next();
  };
};