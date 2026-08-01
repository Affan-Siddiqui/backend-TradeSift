// storage.service.ts
import { CloudinaryProvider } from './cloudinary.provider.js';
class StorageCoordinator {
    provider;
    constructor() {
        // Currently hardcoded to Cloudinary, but can be injected or configured dynamically in the future.
        this.provider = new CloudinaryProvider();
    }
    /**
     * Uploads a file buffer via the active storage provider.
     */
    async uploadDocument(fileBuffer, mimeType, originalFileName) {
        return this.provider.uploadFile(fileBuffer, mimeType, originalFileName, 'tradesift_documents');
    }
    /**
     * Deletes a document via the active storage provider.
     */
    async deleteDocument(publicId) {
        return this.provider.deleteFile(publicId);
    }
    /**
     * Retrieves the public URL for a document.
     */
    getDocumentUrl(publicId) {
        return this.provider.getPublicUrl(publicId);
    }
}
// Export a singleton instance of the coordinator
export const StorageService = new StorageCoordinator();
//# sourceMappingURL=storage.service.js.map