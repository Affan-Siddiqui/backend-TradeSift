// document.repository.ts
import prisma from '../../../prisma/client.js';
export const createDocument = async (data) => {
    return prisma.document.create({
        data,
    });
};
export const createMultipleDocuments = async (dataArray) => {
    return prisma.$transaction(dataArray.map((data) => prisma.document.create({ data })));
};
export const findDocumentsByOperationId = async (operationId) => {
    return prisma.document.findMany({
        where: { operationId },
        orderBy: { createdAt: 'asc' },
    });
};
export const findAllDocumentsByUserId = async (userId) => {
    return prisma.document.findMany({
        where: { userId },
        include: {
            operation: {
                select: {
                    id: true,
                    referenceNo: true,
                    operationType: true,
                    status: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};
export const findDocumentById = async (id) => {
    return prisma.document.findUnique({
        where: { id },
    });
};
export const deleteDocumentById = async (id) => {
    return prisma.document.delete({
        where: { id },
    });
};
//# sourceMappingURL=document.repository.js.map