// operation.routes.ts

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate, validateQuery, validateParams } from '../../middleware/validation.middleware.js';
import { createOperationSchema, updateOperationSchema, listOperationsQuerySchema, operationIdParamSchema } from './operation.schema.js';
import {
  createOperation,
  getOperationById,
  listUserOperations,
  updateOperation,
  deleteOperation,
} from './operation.controller.js';
import { upload } from '../../middleware/upload.middleware.js';
import { createDocumentHandler, listDocumentsHandler } from '../documents/document.controller.js';
import { MAX_UPLOAD_FILES } from '../documents/document.constants.js';

const router = Router();

router.post('/', requireAuth, validate(createOperationSchema), createOperation);
router.get('/', requireAuth, validateQuery(listOperationsQuerySchema), listUserOperations);
router.get('/:id', requireAuth, validateParams(operationIdParamSchema), getOperationById);
router.patch('/:id', requireAuth, validateParams(operationIdParamSchema), validate(updateOperationSchema), updateOperation);
router.delete('/:id', requireAuth, validateParams(operationIdParamSchema), deleteOperation);

// Document endpoints nested under operation
router.post('/:id/documents', requireAuth, validateParams(operationIdParamSchema), upload.array('files', MAX_UPLOAD_FILES), createDocumentHandler);
router.get('/:id/documents', requireAuth, validateParams(operationIdParamSchema), listDocumentsHandler);

export default router;
