// processing.repository.ts
import prisma from '../../../prisma/client.js';
import type { ProcessingStatus } from '@prisma/client';

export const createProcessingJob = async (data: {
  operationId: string;
  userId: string;
}) => {
  return prisma.processingJob.create({
    data: {
      ...data,
      status: 'PENDING',
    },
  });
};

export const findProcessingJobById = async (id: string) => {
  return prisma.processingJob.findUnique({
    where: { id },
  });
};

export const findLatestProcessingJobByOperationId = async (operationId: string) => {
  return prisma.processingJob.findFirst({
    where: { operationId },
    orderBy: { createdAt: 'desc' },
  });
};

export const findActiveProcessingJobsCountByOperationId = async (operationId: string) => {
  return prisma.processingJob.count({
    where: {
      operationId,
      status: {
        in: ['PENDING', 'QUEUED', 'PROCESSING'],
      },
    },
  });
};

export const updateProcessingJobStatus = async (
  id: string,
  data: {
    status?: ProcessingStatus;
    progress?: number;
    currentStage?: string | null;
    estimatedCompletion?: Date | null;
    stages?: any;
    startedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    errorMessage?: string | null;
  }
) => {
  return prisma.processingJob.update({
    where: { id },
    data,
  });
};
