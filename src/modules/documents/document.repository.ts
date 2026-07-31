// document.repository.ts

import prisma from '../../../prisma/client.js';
import type { DocumentUploadStatus } from '@prisma/client';

export const createDocument = async (data: {
  operationId: string;
  userId: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  uploadStatus: DocumentUploadStatus;
}) => {
  return prisma.document.create({
    data,
  });
};

export const findDocumentsByOperationId = async (operationId: string) => {
  return prisma.document.findMany({
    where: { operationId },
    orderBy: { createdAt: 'asc' },
  });
};

export const findDocumentById = async (id: string) => {
  return prisma.document.findUnique({
    where: { id },
  });
};

export const deleteDocumentById = async (id: string) => {
  return prisma.document.delete({
    where: { id },
  });
};
