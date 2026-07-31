// document.routes.ts

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateParams } from '../../middleware/validation.middleware.js';
import { documentIdParamSchema } from './document.schema.js';
import { getDocumentHandler, deleteDocumentHandler } from './document.controller.js';

const router = Router();

// Apply auth to all document routes
router.use(requireAuth);

router.get('/:id', validateParams(documentIdParamSchema), getDocumentHandler);
router.delete('/:id', validateParams(documentIdParamSchema), deleteDocumentHandler);

export default router;
