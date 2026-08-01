// processing.repository.ts
import prisma from '../../../prisma/client.js';
export const createProcessingJob = async (data) => {
    return prisma.processingJob.create({
        data: {
            ...data,
            status: 'PENDING',
        },
    });
};
export const findProcessingJobById = async (id) => {
    return prisma.processingJob.findUnique({
        where: { id },
    });
};
export const findLatestProcessingJobByOperationId = async (operationId) => {
    return prisma.processingJob.findFirst({
        where: { operationId },
        orderBy: { createdAt: 'desc' },
    });
};
export const findActiveProcessingJobsCountByOperationId = async (operationId) => {
    return prisma.processingJob.count({
        where: {
            operationId,
            status: {
                in: ['PENDING', 'QUEUED', 'PROCESSING'],
            },
        },
    });
};
export const updateProcessingJobStatus = async (id, data) => {
    return prisma.processingJob.update({
        where: { id },
        data,
    });
};
//# sourceMappingURL=processing.repository.js.map