import type { DocumentUploadStatus, StorageProvider } from '@prisma/client';
export declare const createDocument: (data: {
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: StorageProvider;
    storageKey: string;
    uploadStatus: DocumentUploadStatus;
}) => Promise<{
    id: string;
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: import(".prisma/client").$Enums.StorageProvider;
    storageKey: string;
    uploadStatus: import(".prisma/client").$Enums.DocumentUploadStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const createMultipleDocuments: (dataArray: {
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: StorageProvider;
    storageKey: string;
    uploadStatus: DocumentUploadStatus;
}[]) => Promise<{
    id: string;
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: import(".prisma/client").$Enums.StorageProvider;
    storageKey: string;
    uploadStatus: import(".prisma/client").$Enums.DocumentUploadStatus;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const findDocumentsByOperationId: (operationId: string) => Promise<{
    id: string;
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: import(".prisma/client").$Enums.StorageProvider;
    storageKey: string;
    uploadStatus: import(".prisma/client").$Enums.DocumentUploadStatus;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const findAllDocumentsByUserId: (userId: string) => Promise<({
    operation: {
        id: string;
        operationType: import(".prisma/client").$Enums.OperationType;
        referenceNo: string | null;
        status: import(".prisma/client").$Enums.OperationStatus;
    };
} & {
    id: string;
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: import(".prisma/client").$Enums.StorageProvider;
    storageKey: string;
    uploadStatus: import(".prisma/client").$Enums.DocumentUploadStatus;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const findDocumentById: (id: string) => Promise<{
    id: string;
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: import(".prisma/client").$Enums.StorageProvider;
    storageKey: string;
    uploadStatus: import(".prisma/client").$Enums.DocumentUploadStatus;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const deleteDocumentById: (id: string) => Promise<{
    id: string;
    operationId: string;
    userId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    storageProvider: import(".prisma/client").$Enums.StorageProvider;
    storageKey: string;
    uploadStatus: import(".prisma/client").$Enums.DocumentUploadStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=document.repository.d.ts.map