import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
export declare const createDocumentHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const listDocumentsHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const listAllDocumentsHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDocumentHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDocumentHandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=document.controller.d.ts.map