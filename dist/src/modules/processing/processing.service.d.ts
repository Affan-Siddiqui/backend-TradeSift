import type { SafeProcessingJob } from './processing.types.js';
import type { ProcessingStatus } from '@prisma/client';
/**
 * Starts processing for an operation
 */
export declare const startProcessing: (userId: string, operationId: string) => Promise<SafeProcessingJob>;
/**
 * Centralized function to update a job's status and manage Operation transitions.
 * Invoked primarily by the background worker.
 */
export declare const updateJobStatus: (userId: string, jobId: string, data: {
    status?: ProcessingStatus;
    progress?: number;
    currentStage?: string | null;
    estimatedCompletion?: Date | null;
    stages?: any;
    startedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    errorMessage?: string | null;
}) => Promise<{
    id: string;
    operationId: string;
    userId: string;
    status: import(".prisma/client").$Enums.ProcessingStatus;
    progress: number;
    currentStage: string | null;
    estimatedCompletion: Date | null;
    stages: import(".prisma/client").Prisma.JsonValue | null;
    startedAt: Date | null;
    completedAt: Date | null;
    failedAt: Date | null;
    errorMessage: string | null;
    retryCount: number;
    createdAt: Date;
    updatedAt: Date;
}>;
/**
 * Gets the latest processing job status for an operation
 */
export declare const getOperationProcessingStatus: (userId: string, operationId: string) => Promise<SafeProcessingJob>;
/**
 * Orchestrates the full AI processing pipeline for a queued job.
 * Invoked by the background worker.
 */
export declare const executeProcessingJob: (userId: string, jobId: string) => Promise<void>;
//# sourceMappingURL=processing.service.d.ts.map