// processing.queue.ts
import { Queue } from 'bullmq';
import { env } from '../../config/env.js';
import { OPERATION_PROCESSING_QUEUE } from './processing.constants.js';
// We need an IORedis instance configuration. BullMQ can take a redis URL directly in newer versions or connection object.
// We use a separate connection config for BullMQ as recommended to avoid blocking.
const connection = {
    url: env.REDIS_URL,
    maxRetriesPerRequest: null,
};
export const processingQueue = new Queue(OPERATION_PROCESSING_QUEUE, {
    connection,
});
export const enqueueProcessingJob = async (jobData) => {
    return processingQueue.add('process_documents', jobData, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
};
//# sourceMappingURL=processing.queue.js.map