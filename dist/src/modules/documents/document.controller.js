// document.controller.ts
import { ApiResponse } from '../../common/ApiResponse.js';
import { ApiError } from '../../common/ApiError.js';
import { uploadDocuments, listOperationDocuments, listAllUserDocuments, getDocument, deleteExistingDocument, } from './document.service.js';
export const createDocumentHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: operationId } = req.params; // From /operations/:id/documents
        const files = req.files;
        if (!files || files.length === 0) {
            throw new ApiError(400, 'No files uploaded');
        }
        const documents = await uploadDocuments(req.userId, operationId, files);
        res.status(201).json(new ApiResponse('Documents uploaded successfully.', documents));
    }
    catch (err) {
        next(err);
    }
};
export const listDocumentsHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: operationId } = req.params; // From /operations/:id/documents
        const documents = await listOperationDocuments(req.userId, operationId);
        res.status(200).json(new ApiResponse('Documents fetched.', { documents }));
    }
    catch (err) {
        next(err);
    }
};
export const listAllDocumentsHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const documents = await listAllUserDocuments(req.userId);
        res.status(200).json(new ApiResponse('All documents fetched.', { documents }));
    }
    catch (err) {
        next(err);
    }
};
export const getDocumentHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: documentId } = req.params; // From /documents/:id
        const document = await getDocument(req.userId, documentId);
        res.status(200).json(new ApiResponse('Document fetched.', document));
    }
    catch (err) {
        next(err);
    }
};
export const deleteDocumentHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: documentId } = req.params; // From /documents/:id
        await deleteExistingDocument(req.userId, documentId);
        res.status(200).json(new ApiResponse('Document deleted.', null));
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=document.controller.js.map