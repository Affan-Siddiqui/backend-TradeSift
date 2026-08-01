import { z } from 'zod';
export declare const createOperationSchema: z.ZodObject<{
    operationType: z.ZodEnum<{
        GATE_IN: "GATE_IN";
        GATE_OUT: "GATE_OUT";
    }>;
    referenceNo: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateOperationInput = z.infer<typeof createOperationSchema>;
export declare const updateOperationSchema: z.ZodObject<{
    referenceNo: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PROCESSING: "PROCESSING";
        CANCELLED: "CANCELLED";
        REVIEW: "REVIEW";
    }>>;
}, z.core.$strip>;
export type UpdateOperationInput = z.infer<typeof updateOperationSchema>;
export declare const operationIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type OperationIdParam = z.infer<typeof operationIdParamSchema>;
export declare const listOperationsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    operationType: z.ZodOptional<z.ZodEnum<{
        GATE_IN: "GATE_IN";
        GATE_OUT: "GATE_OUT";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PROCESSING: "PROCESSING";
        CANCELLED: "CANCELLED";
        REVIEW: "REVIEW";
        COMPLETED: "COMPLETED";
    }>>;
}, z.core.$strip>;
export type ListOperationsQuery = z.infer<typeof listOperationsQuerySchema>;
//# sourceMappingURL=operation.schema.d.ts.map