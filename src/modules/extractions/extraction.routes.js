// extraction.routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate, validateParams } from '../../middleware/validation.middleware.js';
import { extractionIdParamSchema, updateExtractionSchema, rejectExtractionSchema, } from './extraction.schema.js';
import { updateExtractionHandler, approveExtractionHandler, rejectExtractionHandler, } from './extraction.controller.js';
const router = Router();
router.patch('/:id', requireAuth, validateParams(extractionIdParamSchema), validate(updateExtractionSchema), updateExtractionHandler);
router.post('/:id/approve', requireAuth, validateParams(extractionIdParamSchema), approveExtractionHandler);
router.post('/:id/reject', requireAuth, validateParams(extractionIdParamSchema), validate(rejectExtractionSchema), rejectExtractionHandler);
export default router;
//# sourceMappingURL=extraction.routes.js.map