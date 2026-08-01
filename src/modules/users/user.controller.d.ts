import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import type { UpdateUserInput } from './user.schema.js';
export declare const getMe: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateMe: (req: AuthenticatedRequest & Request<unknown, unknown, UpdateUserInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteMe: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllUsers: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteAllUsers: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map