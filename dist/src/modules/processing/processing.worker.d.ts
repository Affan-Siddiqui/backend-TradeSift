import { Worker } from 'bullmq';
import type { ProcessingJobData } from './processing.types.js';
export declare const initProcessingWorker: () => Worker<ProcessingJobData, any, string, import("bullmq").RedisQueueBackend>;
//# sourceMappingURL=processing.worker.d.ts.map