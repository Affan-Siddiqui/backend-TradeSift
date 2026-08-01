// processing.types.ts
import type { ProcessingStatus } from '@prisma/client';

export interface SafeProcessingJob {
  id: string;
  operationId: string;
  userId: string;
  status: ProcessingStatus;
  progress: number;
  currentStage: string | null;
  estimatedCompletion: Date | null;
  stages: Record<string, any> | null;
  startedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessingJobData {
  jobId: string;
  operationId: string;
  userId: string;
}
