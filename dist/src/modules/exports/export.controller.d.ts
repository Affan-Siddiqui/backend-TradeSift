import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
export declare const exportExtractionHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportOperationHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=export.controller.d.ts.map