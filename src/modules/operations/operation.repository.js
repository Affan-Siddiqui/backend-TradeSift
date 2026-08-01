// operation.repository.ts
import { OperationStatus, OperationType } from '@prisma/client';
import prisma from '../../../prisma/client.js';
// import type OperationStatus from '../../../prisma/client.js';
// import type OperationType from '../../../prisma/client.js';
// ---------- Create ----------
export const createOperation = async (data) => {
    return prisma.operation.create({ data });
};
// ---------- Find One ----------
export const findOperationById = async (id) => {
    return prisma.operation.findUnique({ where: { id } });
};
// ---------- Find Many (paginated) ----------
export const findOperationsByUserId = async (userId, filters, pagination) => {
    const where = {
        userId,
        ...(filters.operationType !== undefined && { operationType: filters.operationType }),
        ...(filters.status !== undefined && { status: filters.status }),
    };
    return prisma.operation.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
    });
};
// ---------- Count ----------
export const countOperationsByUserId = async (userId, filters) => {
    const where = {
        userId,
        ...(filters.operationType !== undefined && { operationType: filters.operationType }),
        ...(filters.status !== undefined && { status: filters.status }),
    };
    return prisma.operation.count({ where });
};
// ---------- Update ----------
export const updateOperationById = async (id, data) => {
    return prisma.operation.update({ where: { id }, data });
};
// ---------- Delete ----------
export const deleteOperationById = async (id) => {
    return prisma.operation.delete({ where: { id } });
};
//# sourceMappingURL=operation.repository.js.map