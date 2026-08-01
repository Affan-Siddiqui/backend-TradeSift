import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
export declare const startProcessingHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getOperationProcessingStatusHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=processing.controller.d.ts.map