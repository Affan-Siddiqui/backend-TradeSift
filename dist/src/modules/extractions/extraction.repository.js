// extraction.repository.ts
import prisma from '../../../prisma/client.js';
export const createExtractions = async (dataArray) => {
    return prisma.extraction.createMany({
        data: dataArray,
    });
};
export const findExtractionsByOperationId = async (operationId) => {
    return prisma.extraction.findMany({
        where: { operationId },
        orderBy: { createdAt: 'desc' },
    });
};
export const findExtractionById = async (id) => {
    return prisma.extraction.findUnique({
        where: { id },
    });
};
export const updateExtractionById = async (id, data) => {
    return prisma.extraction.update({
        where: { id },
        data,
    });
};
//# sourceMappingURL=extraction.repository.js.map