// operation.controller.ts

import type { Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/ApiResponse.js';
import { ApiError } from '../../common/ApiError.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import type { CreateOperationInput, UpdateOperationInput, ListOperationsQuery } from './operation.schema.js';
import {
  createNewOperation,
  getOperation,
  listOperations,
  updateExistingOperation,
  deleteExistingOperation,
} from './operation.service.js';

export const createOperation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const input = req.body as CreateOperationInput;
    const operation = await createNewOperation(req.userId, input);
    res.status(201).json(new ApiResponse('Operation created.', operation));
  } catch (err) {
    next(err);
  }
};

export const getOperationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id } = req.params as { id: string };
    const operation = await getOperation(req.userId, id);
    res.status(200).json(new ApiResponse('Operation fetched.', operation));
  } catch (err) {
    next(err);
  }
};

export const listUserOperations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const query = req.query as unknown as ListOperationsQuery;
    const result = await listOperations(req.userId, query);
    res.status(200).json(new ApiResponse('Operations fetched.', result));
  } catch (err) {
    next(err);
  }
};

export const updateOperation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id } = req.params as { id: string };
    const input = req.body as UpdateOperationInput;
    const operation = await updateExistingOperation(req.userId, id, input);
    res.status(200).json(new ApiResponse('Operation updated.', operation));
  } catch (err) {
    next(err);
  }
};

export const deleteOperation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id } = req.params as { id: string };
    await deleteExistingOperation(req.userId, id);
    res.status(200).json(new ApiResponse('Operation deleted.', null));
  } catch (err) {
    next(err);
  }
};
