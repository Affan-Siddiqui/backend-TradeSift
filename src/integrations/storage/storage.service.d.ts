declare class StorageCoordinator {
    private provider;
    constructor();
    /**
     * Uploads a file buffer via the active storage provider.
     */
    uploadDocument(fileBuffer: Buffer, mimeType: string, originalFileName?: string): Promise<{
        publicId: string;
    }>;
    /**
     * Deletes a document via the active storage provider.
     */
    deleteDocument(publicId: string): Promise<boolean>;
    /**
     * Retrieves the public URL for a document.
     */
    getDocumentUrl(publicId: string): string;
}
export declare const StorageService: StorageCoordinator;
export {};
//# sourceMappingURL=storage.service.d.ts.map