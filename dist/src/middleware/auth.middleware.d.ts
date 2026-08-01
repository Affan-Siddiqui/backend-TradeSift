import type { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    userId?: string;
}
export declare const requireAuth: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map