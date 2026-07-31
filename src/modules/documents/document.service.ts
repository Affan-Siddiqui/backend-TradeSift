// document.service.ts

import { randomUUID } from 'crypto';
import { ApiError } from '../../common/ApiError.js';
import {
  createMultipleDocuments,
  findDocumentsByOperationId,
  findDocumentById,
  deleteDocumentById,
} from './document.repository.js';
import { findOperationById } from '../operations/operation.repository.js';
import type { SafeDocument } from './document.types.js';
import type { Document } from '@prisma/client';

// ---------- Helpers ----------

const toSafeDocument = (doc: Document): SafeDocument => ({
  id: doc.id,
  operationId: doc.operationId,
  originalFileName: doc.originalFileName,
  mimeType: doc.mimeType,
  fileSize: doc.fileSize,
  uploadStatus: doc.uploadStatus,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

/**
 * Fetches an operation and verifies ownership.
 */
const verifyOperationOwnership = async (userId: string, operationId: string) => {
  const operation = await findOperationById(operationId);
  if (!operation || operation.userId !== userId) {
    throw new ApiError(404, 'Operation not found.');
  }
  return operation;
};

/**
 * Fetches a document and verifies ownership.
 */
const findOwnedDocument = async (userId: string, documentId: string): Promise<Document> => {
  const document = await findDocumentById(documentId);
  if (!document || document.userId !== userId) {
    throw new ApiError(404, 'Document not found.');
  }
  return document;
};

// ---------- Create (Upload) ----------

export const uploadDocuments = async (
  userId: string,
  operationId: string,
  files: Express.Multer.File[]
): Promise<SafeDocument[]> => {
  // 1. Verify operation ownership
  await verifyOperationOwnership(userId, operationId);

  // 2. Prepare document data for atomic insertion
  const documentDataArray = files.map((file) => ({
    operationId,
    userId,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    storageKey: `temp_${randomUUID()}`, // Phase 3 will use real storage
    uploadStatus: 'UPLOADED' as const, // Simulated as immediately successful since we use memory storage
  }));

  // 3. Create document records atomically
  const documents = await createMultipleDocuments(documentDataArray);

  return documents.map(toSafeDocument);
};

// ---------- List ----------

export const listOperationDocuments = async (
  userId: string,
  operationId: string
): Promise<SafeDocument[]> => {
  await verifyOperationOwnership(userId, operationId);
  
  const documents = await findDocumentsByOperationId(operationId);
  return documents.map(toSafeDocument);
};

// ---------- Get One ----------

export const getDocument = async (userId: string, documentId: string): Promise<SafeDocument> => {
  const document = await findOwnedDocument(userId, documentId);
  return toSafeDocument(document);
};

// ---------- Delete ----------

export const deleteExistingDocument = async (userId: string, documentId: string): Promise<void> => {
  await findOwnedDocument(userId, documentId);
  
  // Phase 3 note: Actual storage deletion (e.g. Cloudinary) should happen here
  
  await deleteDocumentById(documentId);
};
