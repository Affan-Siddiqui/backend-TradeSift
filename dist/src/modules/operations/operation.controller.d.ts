import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
export declare const createOperation: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOperationById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const listUserOperations: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOperation: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteOperation: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=operation.controller.d.ts.map