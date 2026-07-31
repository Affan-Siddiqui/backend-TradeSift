// document.repository.ts

import prisma from '../../../prisma/client.js';
import type { DocumentUploadStatus, StorageProvider } from '@prisma/client';

export const createDocument = async (data: {
  operationId: string;
  userId: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  storageProvider: StorageProvider;
  storageKey: string;
  uploadStatus: DocumentUploadStatus;
}) => {
  return prisma.document.create({
    data,
  });
};

export const createMultipleDocuments = async (dataArray: {
  operationId: string;
  userId: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  storageProvider: StorageProvider;
  storageKey: string;
  uploadStatus: DocumentUploadStatus;
}[]) => {
  return prisma.$transaction(
    dataArray.map((data) => prisma.document.create({ data }))
  );
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
