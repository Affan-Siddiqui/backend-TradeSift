import { OperationStatus, OperationType } from '@prisma/client';
export declare const createOperation: (data: {
    userId: string;
    operationType: OperationType;
    referenceNo?: string | null;
    notes?: string | null;
}) => Promise<{
    id: string;
    userId: string;
    operationType: import(".prisma/client").$Enums.OperationType;
    status: import(".prisma/client").$Enums.OperationStatus;
    referenceNo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const findOperationById: (id: string) => Promise<{
    id: string;
    userId: string;
    operationType: import(".prisma/client").$Enums.OperationType;
    status: import(".prisma/client").$Enums.OperationStatus;
    referenceNo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const findOperationsByUserId: (userId: string, filters: {
    operationType?: OperationType;
    status?: OperationStatus;
}, pagination: {
    skip: number;
    take: number;
}) => Promise<{
    id: string;
    userId: string;
    operationType: import(".prisma/client").$Enums.OperationType;
    status: import(".prisma/client").$Enums.OperationStatus;
    referenceNo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const countOperationsByUserId: (userId: string, filters: {
    operationType?: OperationType;
    status?: OperationStatus;
}) => Promise<number>;
export declare const updateOperationById: (id: string, data: {
    referenceNo?: string | null;
    notes?: string | null;
    status?: OperationStatus;
}) => Promise<{
    id: string;
    userId: string;
    operationType: import(".prisma/client").$Enums.OperationType;
    status: import(".prisma/client").$Enums.OperationStatus;
    referenceNo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteOperationById: (id: string) => Promise<{
    id: string;
    userId: string;
    operationType: import(".prisma/client").$Enums.OperationType;
    status: import(".prisma/client").$Enums.OperationStatus;
    referenceNo: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=operation.repository.d.ts.map