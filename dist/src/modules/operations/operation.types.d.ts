import type { OperationType, OperationStatus } from '@prisma/client';
export interface SafeOperation {
    id: string;
    userId: string;
    operationType: OperationType;
    status: OperationStatus;
    referenceNo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaginatedOperations {
    operations: SafeOperation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=operation.types.d.ts.map