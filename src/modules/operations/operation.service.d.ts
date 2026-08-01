import type { CreateOperationInput, UpdateOperationInput, ListOperationsQuery } from './operation.schema.js';
import type { SafeOperation, PaginatedOperations } from './operation.types.js';
export declare const createNewOperation: (userId: string, input: CreateOperationInput) => Promise<SafeOperation>;
export declare const getOperation: (userId: string, operationId: string) => Promise<SafeOperation>;
export declare const listOperations: (userId: string, query: ListOperationsQuery) => Promise<PaginatedOperations>;
export declare const updateExistingOperation: (userId: string, operationId: string, input: UpdateOperationInput) => Promise<SafeOperation>;
export declare const deleteExistingOperation: (userId: string, operationId: string) => Promise<void>;
//# sourceMappingURL=operation.service.d.ts.map