// cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { env } from '../../config/env.js';
import { ApiError } from '../../common/ApiError.js';
import type { IStorageProvider } from './storage.types.js';

export class CloudinaryProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  public async uploadFile(
    fileBuffer: Buffer,
    mimeType: string,
    originalFileName?: string,
    folder?: string
  ): Promise<{ publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'tradesift_documents',
          resource_type: 'auto', // Automatically detects image, raw (PDF, Word), etc.
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(new ApiError(500, 'Failed to upload file to Cloudinary.'));
          }
          if (!result) {
            return reject(new ApiError(500, 'Cloudinary returned an empty response.'));
          }
          resolve({ publicId: result.public_id });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  public async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      // Cloudinary returns { result: 'ok' } or { result: 'not found' }
      if (result.result === 'ok' || result.result === 'not found') {
        return true;
      }
      
      throw new Error(`Cloudinary returned status: ${result.result}`);
    } catch (err) {
      throw new ApiError(500, 'Failed to delete file from Cloudinary.');
    }
  }

  public getPublicUrl(publicId: string): string {
    // Generates a URL for the given publicId.
    // By default, Cloudinary generates HTTP URLs.
    return cloudinary.url(publicId, { secure: true });
  }
}
