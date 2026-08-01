// processing.service.ts
import { ApiError } from '../../common/ApiError.js';
import { createProcessingJob, findActiveProcessingJobsCountByOperationId, findLatestProcessingJobByOperationId, findProcessingJobById, updateProcessingJobStatus } from './processing.repository.js';
import { enqueueProcessingJob } from './processing.queue.js';
import { findOperationById } from '../operations/operation.repository.js';
import { findDocumentsByOperationId } from '../documents/document.repository.js';
import { updateExistingOperation } from '../operations/operation.service.js';
import { StorageService } from '../../integrations/storage/storage.service.js';
import { AIClient } from '../../integrations/ai/ai.client.js';
import { saveExtractions } from '../extractions/extraction.service.js';
const toSafeProcessingJob = (job) => ({
    id: job.id,
    operationId: job.operationId,
    userId: job.userId,
    status: job.status,
    progress: job.progress,
    currentStage: job.currentStage,
    estimatedCompletion: job.estimatedCompletion,
    stages: job.stages ? job.stages : null,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    failedAt: job.failedAt,
    errorMessage: job.errorMessage,
    retryCount: job.retryCount,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
});
/**
 * Validates operation ownership and returns the operation
 */
const verifyOperationOwnership = async (userId, operationId) => {
    const operation = await findOperationById(operationId);
    if (!operation || operation.userId !== userId) {
        throw new ApiError(404, 'Operation not found.');
    }
    return operation;
};
/**
 * Starts processing for an operation
 */
export const startProcessing = async (userId, operationId) => {
    await verifyOperationOwnership(userId, operationId);
    // Check if documents exist
    const documents = await findDocumentsByOperationId(operationId);
    if (documents.length === 0) {
        throw new ApiError(400, 'Cannot process operation without uploaded documents.');
    }
    // Prevent duplicate active jobs
    const activeCount = await findActiveProcessingJobsCountByOperationId(operationId);
    if (activeCount > 0) {
        throw new ApiError(409, 'An active processing job already exists for this operation.');
    }
    // Create PENDING job in DB
    const job = await createProcessingJob({ operationId, userId });
    // Enqueue in BullMQ
    try {
        await enqueueProcessingJob({
            jobId: job.id,
            operationId,
            userId,
        });
        // Update job status to QUEUED
        const queuedJob = await updateProcessingJobStatus(job.id, { status: 'QUEUED' });
        // Update operation status to PROCESSING
        await updateExistingOperation(userId, operationId, { status: 'PROCESSING' });
        return toSafeProcessingJob(queuedJob);
    }
    catch (error) {
        // If enqueue fails, mark job as FAILED
        await updateProcessingJobStatus(job.id, {
            status: 'FAILED',
            errorMessage: 'Failed to enqueue job in Redis.',
            failedAt: new Date()
        });
        throw new ApiError(500, 'Failed to enqueue processing job.');
    }
};
/**
 * Centralized function to update a job's status and manage Operation transitions.
 * Invoked primarily by the background worker.
 */
export const updateJobStatus = async (userId, jobId, data) => {
    const job = await findProcessingJobById(jobId);
    if (!job)
        throw new ApiError(404, 'Processing job not found.');
    const updatedJob = await updateProcessingJobStatus(jobId, data);
    if (data.status === 'COMPLETED') {
        await updateExistingOperation(userId, job.operationId, { status: 'REVIEW' });
    }
    else if (data.status === 'FAILED') {
        // Optionally move back to DRAFT or to a FAILED state if your workflow supports it
    }
    return updatedJob;
};
/**
 * Gets the latest processing job status for an operation
 */
export const getOperationProcessingStatus = async (userId, operationId) => {
    await verifyOperationOwnership(userId, operationId);
    const job = await findLatestProcessingJobByOperationId(operationId);
    if (!job) {
        throw new ApiError(404, 'No processing jobs found for this operation.');
    }
    return toSafeProcessingJob(job);
};
/**
 * Orchestrates the full AI processing pipeline for a queued job.
 * Invoked by the background worker.
 */
export const executeProcessingJob = async (userId, jobId) => {
    const job = await findProcessingJobById(jobId);
    if (!job)
        throw new ApiError(404, 'Processing job not found.');
    const operationId = job.operationId;
    // 1. Update status to PROCESSING
    await updateJobStatus(userId, jobId, {
        status: 'PROCESSING',
        startedAt: new Date(),
        progress: 10,
        currentStage: 'Fetching Documents',
    });
    // 2. Fetch documents and construct AI payload
    const documents = await findDocumentsByOperationId(operationId);
    const aiDocumentInputs = documents.map(doc => ({
        documentId: doc.id,
        url: StorageService.getDocumentUrl(doc.storageKey),
    }));
    await updateJobStatus(userId, jobId, {
        progress: 30,
        currentStage: 'AI Extraction',
    });
    // 3. Call AI Client
    const aiResponse = await AIClient.extractDocuments({
        operationId,
        documents: aiDocumentInputs,
    });
    await updateJobStatus(userId, jobId, {
        progress: 80,
        currentStage: 'Saving Extractions',
    });
    // 4. Save extractions to database
    await saveExtractions(operationId, jobId, aiResponse);
    // 5. Update status to COMPLETED
    await updateJobStatus(userId, jobId, {
        status: 'COMPLETED',
        progress: 100,
        currentStage: 'Done',
        completedAt: new Date(),
    });
};
//# sourceMappingURL=processing.service.js.map