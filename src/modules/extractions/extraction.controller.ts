// extraction.controller.ts

import type { Response, NextFunction } from 'express';
import { getOperationExtractions, updateExtraction, approveExtraction, rejectExtraction } from './extraction.service.js';
import { ApiResponse } from '../../common/ApiResponse.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../common/ApiError.js';

export const getOperationExtractionHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: operationId } = req.params as { id: string };

    const extractions = await getOperationExtractions(req.userId, operationId);
    
    return res.status(200).json(new ApiResponse('Extractions fetched successfully.', extractions));
  } catch (error) {
    next(error);
  }
};

export const updateExtractionHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: extractionId } = req.params as { id: string };
    const { editedFields, reviewerNotes } = req.body;

    const updated = await updateExtraction(req.userId, extractionId, { editedFields, reviewerNotes });
    
    return res.status(200).json(new ApiResponse('Extraction updated successfully.', updated));
  } catch (error) {
    next(error);
  }
};

export const approveExtractionHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: extractionId } = req.params as { id: string };

    const approved = await approveExtraction(req.userId, extractionId);
    
    return res.status(200).json(new ApiResponse('Extraction approved successfully.', approved));
  } catch (error) {
    next(error);
  }
};

export const rejectExtractionHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: extractionId } = req.params as { id: string };
    const { reason } = req.body;

    const rejected = await rejectExtraction(req.userId, extractionId, reason);
    
    return res.status(200).json(new ApiResponse('Extraction rejected successfully.', rejected));
  } catch (error) {
    next(error);
  }
};
