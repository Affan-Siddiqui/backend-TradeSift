// storage.service.ts
import { CloudinaryProvider } from './cloudinary.provider.js';
import type { IStorageProvider } from './storage.types.js';

class StorageCoordinator {
  private provider: IStorageProvider;

  constructor() {
    // Currently hardcoded to Cloudinary, but can be injected or configured dynamically in the future.
    this.provider = new CloudinaryProvider();
  }

  /**
   * Uploads a file buffer via the active storage provider.
   */
  public async uploadDocument(
    fileBuffer: Buffer,
    mimeType: string,
    originalFileName?: string
  ): Promise<{ publicId: string }> {
    return this.provider.uploadFile(fileBuffer, mimeType, originalFileName, 'tradesift_documents');
  }

  /**
   * Deletes a document via the active storage provider.
   */
  public async deleteDocument(publicId: string): Promise<boolean> {
    return this.provider.deleteFile(publicId);
  }

  /**
   * Retrieves the public URL for a document.
   */
  public getDocumentUrl(publicId: string): string {
    return this.provider.getPublicUrl(publicId);
  }
}

// Export a singleton instance of the coordinator
export const StorageService = new StorageCoordinator();
