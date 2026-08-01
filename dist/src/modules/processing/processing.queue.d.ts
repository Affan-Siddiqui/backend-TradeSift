import { Queue } from 'bullmq';
import type { ProcessingJobData } from './processing.types.js';
export declare const processingQueue: Queue<ProcessingJobData, any, string, ProcessingJobData, any, string, import("bullmq").RedisQueueBackend>;
export declare const enqueueProcessingJob: (jobData: ProcessingJobData) => Promise<import("bullmq").Job<ProcessingJobData, any, string>>;
//# sourceMappingURL=processing.queue.d.ts.map