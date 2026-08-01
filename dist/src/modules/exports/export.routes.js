// export.routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateParams } from '../../middleware/validation.middleware.js';
import { exportExtractionParamSchema } from './export.schema.js';
import { exportExtractionHandler } from './export.controller.js';
const router = Router();
router.post('/:id/export', requireAuth, validateParams(exportExtractionParamSchema), exportExtractionHandler);
export default router;
//# sourceMappingURL=export.routes.js.map