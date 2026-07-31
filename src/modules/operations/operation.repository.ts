// operation.repository.ts

import { OperationStatus, OperationType } from '@prisma/client';
import prisma from '../../../prisma/client.js';
// import type OperationStatus from '../../../prisma/client.js';
// import type OperationType from '../../../prisma/client.js';




// ---------- Create ----------

export const createOperation = async (data: {
  userId: string;
  operationType: OperationType,
  referenceNo?: string | null;
  notes?: string | null;
}) => {
  return prisma.operation.create({ data });
};

// ---------- Find One ----------

export const findOperationById = async (id: string) => {
  return prisma.operation.findUnique({ where: { id } });
};

// ---------- Find Many (paginated) ----------

export const findOperationsByUserId = async (
  userId: string,
  filters: {
    operationType?: OperationType;
    status?: OperationStatus;
  },
  pagination: { skip: number; take: number }
) => {
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

export const countOperationsByUserId = async (
  userId: string,
  filters: {
    operationType?: OperationType;
    status?: OperationStatus;
  }
) => {
  const where = {
    userId,
    ...(filters.operationType !== undefined && { operationType: filters.operationType }),
    ...(filters.status !== undefined && { status: filters.status }),
  };

  return prisma.operation.count({ where });
};

// ---------- Update ----------

export const updateOperationById = async (
  id: string,
  data: {
    referenceNo?: string | null;
    notes?: string | null;
    status?: OperationStatus;
  }
) => {
  return prisma.operation.update({ where: { id }, data });
};

// ---------- Delete ----------

export const deleteOperationById = async (id: string) => {
  return prisma.operation.delete({ where: { id } });
};
