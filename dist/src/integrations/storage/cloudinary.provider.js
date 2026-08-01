// cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';
import { ApiError } from '../../common/ApiError.js';
export class CloudinaryProvider {
    constructor() {
        cloudinary.config({
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadFile(fileBuffer, mimeType, originalFileName, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: folder || 'tradesift_documents',
                resource_type: 'auto', // Automatically detects image, raw (PDF, Word), etc.
            }, (error, result) => {
                if (error) {
                    return reject(new ApiError(500, 'Failed to upload file to Cloudinary.'));
                }
                if (!result) {
                    return reject(new ApiError(500, 'Cloudinary returned an empty response.'));
                }
                resolve({ publicId: result.public_id });
            });
            uploadStream.end(fileBuffer);
        });
    }
    async deleteFile(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            // Cloudinary returns { result: 'ok' } or { result: 'not found' }
            if (result.result === 'ok' || result.result === 'not found') {
                return true;
            }
            throw new Error(`Cloudinary returned status: ${result.result}`);
        }
        catch (err) {
            throw new ApiError(500, 'Failed to delete file from Cloudinary.');
        }
    }
    getPublicUrl(publicId) {
        // Generates a URL for the given publicId.
        // By default, Cloudinary generates HTTP URLs.
        return cloudinary.url(publicId, { secure: true });
    }
}
//# sourceMappingURL=cloudinary.provider.js.map