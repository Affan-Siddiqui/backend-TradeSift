export interface IStorageProvider {
    /**
     * Uploads a file to the storage provider.
     * @param fileBuffer The file content as a Buffer.
     * @param mimeType The file's MIME type.
     * @param originalFileName The original name of the file (optional, for metadata).
     * @param folder The folder to store the file in (optional).
     * @returns A promise that resolves to an object containing the provider-specific public ID / storage key.
     */
    uploadFile(fileBuffer: Buffer, mimeType: string, originalFileName?: string, folder?: string): Promise<{
        publicId: string;
    }>;
    /**
     * Deletes a file from the storage provider.
     * @param publicId The provider-specific public ID / storage key.
     * @returns A promise that resolves to true if successful, or throws an error.
     */
    deleteFile(publicId: string): Promise<boolean>;
    /**
     * Generates a public or signed URL for accessing the file.
     * @param publicId The provider-specific public ID / storage key.
     * @returns The generated URL as a string.
     */
    getPublicUrl(publicId: string): string;
}
//# sourceMappingURL=storage.types.d.ts.map