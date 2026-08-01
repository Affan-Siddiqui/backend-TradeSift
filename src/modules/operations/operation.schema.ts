// operation.schema.ts

import { z } from 'zod';
import { OPERATIONS_DEFAULT_PAGE_SIZE, OPERATIONS_MAX_PAGE_SIZE } from './operation.constants.js';

// ---------- Create Operation ----------

export const createOperationSchema = z.object({
  operationType: z.enum(['GATE_IN', 'GATE_OUT'], {
    message: 'Operation type must be GATE_IN or GATE_OUT',
  }),
  referenceNo: z.string().trim().min(1, 'Reference number cannot be empty').optional(),
  notes: z.string().trim().optional(),
});

export type CreateOperationInput = z.infer<typeof createOperationSchema>;

// ---------- Update Operation ----------

export const updateOperationSchema = z.object({
  referenceNo: z.string().trim().min(1, 'Reference number cannot be empty').optional(),
  notes: z.string().trim().optional(),
  status: z.enum(['PROCESSING', 'REVIEW', 'CANCELLED'], {
    message: 'Status can only be set to PROCESSING, REVIEW, or CANCELLED',
  }).optional(),
});

export type UpdateOperationInput = z.infer<typeof updateOperationSchema>;

// ---------- Params ----------

export const operationIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Operation ID format'),
});

export type OperationIdParam = z.infer<typeof operationIdParamSchema>;

// ---------- List Query ----------

export const listOperationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(OPERATIONS_MAX_PAGE_SIZE).default(OPERATIONS_DEFAULT_PAGE_SIZE),
  operationType: z.enum(['GATE_IN', 'GATE_OUT']).optional(),
  status: z.enum(['DRAFT', 'PROCESSING', 'REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
});

export type ListOperationsQuery = z.infer<typeof listOperationsQuerySchema>;

