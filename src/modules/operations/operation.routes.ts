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

const router = Router();

router.post('/', requireAuth, validate(createOperationSchema), createOperation);
router.get('/', requireAuth, validateQuery(listOperationsQuerySchema), listUserOperations);
router.get('/:id', requireAuth, validateParams(operationIdParamSchema), getOperationById);
router.patch('/:id', requireAuth, validateParams(operationIdParamSchema), validate(updateOperationSchema), updateOperation);
router.delete('/:id', requireAuth, validateParams(operationIdParamSchema), deleteOperation);

export default router;
