import type { Response, NextFunction } from 'express';
import { startProcessing, getOperationProcessingStatus } from './processing.service.js';
import { ApiResponse } from '../../common/ApiResponse.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../common/ApiError.js';

export const startProcessingHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: operationId } = req.params as { id: string };

    const job = await startProcessing(req.userId, operationId);
    
    return res.status(201).json(new ApiResponse('Processing job queued successfully.', job));
  } catch (error) {
    next(error);
  }
};

export const getOperationProcessingStatusHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: operationId } = req.params as { id: string };

    const job = await getOperationProcessingStatus(req.userId, operationId);
    
    return res.status(200).json(new ApiResponse('Processing status fetched.', job));
  } catch (error) {
    next(error);
  }
};
