import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
export declare const validate: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateParams: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.middleware.d.ts.map