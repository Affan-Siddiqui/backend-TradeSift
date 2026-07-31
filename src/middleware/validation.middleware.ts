import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from '../common/ApiError.js';
import logger from '../config/logger.js';

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const message = firstIssue ? firstIssue.message : 'Invalid request data';
      logger.warn(
        { method: req.method, path: req.path, issues: result.error.issues.map((issue) => issue.message) },
        'Request validation failed'
      );
      return next(new ApiError(400, message));
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const message = firstIssue ? firstIssue.message : 'Invalid query parameters';
      logger.warn(
        { method: req.method, path: req.path, issues: result.error.issues.map((issue) => issue.message) },
        'Query validation failed'
      );
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

export const validateParams = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const message = firstIssue ? firstIssue.message : 'Invalid URL parameters';
      logger.warn(
        { method: req.method, path: req.path, issues: result.error.issues.map((issue) => issue.message) },
        'Params validation failed'
      );
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