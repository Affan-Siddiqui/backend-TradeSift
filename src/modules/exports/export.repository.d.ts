export declare const updateExtractionExportStats: (id: string) => Promise<{
    id: string;
    operationId: string;
    processingJobId: string;
    documentId: string;
    documentType: string;
    confidence: number;
    originalFields: import(".prisma/client").Prisma.JsonValue;
    editedFields: import(".prisma/client").Prisma.JsonValue | null;
    rawResponse: import(".prisma/client").Prisma.JsonValue | null;
    status: import(".prisma/client").$Enums.ExtractionStatus;
    approvedBy: string | null;
    approvedAt: Date | null;
    reviewedAt: Date | null;
    reviewerNotes: string | null;
    version: number;
    lastExportedAt: Date | null;
    exportCount: number;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=export.repository.d.ts.map