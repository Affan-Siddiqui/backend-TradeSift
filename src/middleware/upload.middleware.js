import multer from 'multer';
import { ApiError } from '../common/ApiError.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../modules/documents/document.constants.js';
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE, // 10MB
    },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new ApiError(400, 'Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.'));
        }
    },
});
//# sourceMappingURL=upload.middleware.js.map