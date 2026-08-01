// extraction.repository.ts

import prisma from '../../../prisma/client.js';
import type { Prisma } from '@prisma/client';

export const createExtractions = async (dataArray: {
  operationId: string;
  processingJobId: string;
  documentId: string;
  documentType: string;
  confidence: number;
  originalFields: any;
  rawResponse?: any;
}[]) => {
  return prisma.extraction.createMany({
    data: dataArray,
  });
};

export const findExtractionsByOperationId = async (operationId: string) => {
  return prisma.extraction.findMany({
    where: { operationId },
    orderBy: { createdAt: 'desc' },
  });
};

export const findExtractionById = async (id: string) => {
  return prisma.extraction.findUnique({
    where: { id },
  });
};

export const updateExtractionById = async (id: string, data: Prisma.ExtractionUpdateInput) => {
  return prisma.extraction.update({
    where: { id },
    data,
  });
};
