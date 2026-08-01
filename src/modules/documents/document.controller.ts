
// document.controller.ts

import type { Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/ApiResponse.js';
import { ApiError } from '../../common/ApiError.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import {
  uploadDocuments,
  listOperationDocuments,
  listAllUserDocuments,
  getDocument,
  deleteExistingDocument,
} from './document.service.js';

export const createDocumentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: operationId } = req.params as { id: string }; // From /operations/:id/documents
    
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new ApiError(400, 'No files uploaded');
    }

    const documents = await uploadDocuments(req.userId, operationId, files);

    res.status(201).json(new ApiResponse('Documents uploaded successfully.', documents));
  } catch (err) {
    next(err);
  }
};

export const listDocumentsHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: operationId } = req.params as { id: string }; // From /operations/:id/documents

    const documents = await listOperationDocuments(req.userId, operationId);

    res.status(200).json(new ApiResponse('Documents fetched.', { documents }));
  } catch (err) {
    next(err);
  }
};

export const listAllDocumentsHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');

    const documents = await listAllUserDocuments(req.userId);

    res.status(200).json(new ApiResponse('All documents fetched.', { documents }));
  } catch (err) {
    next(err);
  }
};

export const getDocumentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: documentId } = req.params as { id: string }; // From /documents/:id

    const document = await getDocument(req.userId, documentId);

    res.status(200).json(new ApiResponse('Document fetched.', document));
  } catch (err) {
    next(err);
  }
};

export const deleteDocumentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');
    const { id: documentId } = req.params as { id: string }; // From /documents/:id

    await deleteExistingDocument(req.userId, documentId);

    res.status(200).json(new ApiResponse('Document deleted.', null));
  } catch (err) {
    next(err);
  }
};
