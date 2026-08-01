import type { IStorageProvider } from './storage.types.js';
export declare class CloudinaryProvider implements IStorageProvider {
    constructor();
    uploadFile(fileBuffer: Buffer, mimeType: string, originalFileName?: string, folder?: string): Promise<{
        publicId: string;
    }>;
    deleteFile(publicId: string): Promise<boolean>;
    getPublicUrl(publicId: string): string;
}
//# sourceMappingURL=cloudinary.provider.d.ts.map