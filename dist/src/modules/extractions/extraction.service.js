// extraction.service.ts
import { ApiError } from '../../common/ApiError.js';
import { createExtractions, findExtractionsByOperationId, findExtractionById, updateExtractionById } from './extraction.repository.js';
import { findOperationById } from '../operations/operation.repository.js';
const toSafeExtraction = (ext) => ({
    id: ext.id,
    operationId: ext.operationId,
    processingJobId: ext.processingJobId,
    documentId: ext.documentId,
    documentType: ext.documentType,
    confidence: ext.confidence,
    originalFields: ext.originalFields,
    editedFields: ext.editedFields ? ext.editedFields : null,
    rawResponse: ext.rawResponse ? ext.rawResponse : null,
    status: ext.status,
    approvedBy: ext.approvedBy,
    approvedAt: ext.approvedAt,
    reviewedAt: ext.reviewedAt,
    reviewerNotes: ext.reviewerNotes,
    version: ext.version,
    createdAt: ext.createdAt,
    updatedAt: ext.updatedAt,
});
const verifyOperationOwnership = async (userId, operationId) => {
    const operation = await findOperationById(operationId);
    if (!operation || operation.userId !== userId) {
        throw new ApiError(404, 'Operation not found.');
    }
    return operation;
};
export const saveExtractions = async (operationId, processingJobId, aiResponse) => {
    if (!aiResponse.documents || aiResponse.documents.length === 0) {
        return;
    }
    const dataArray = aiResponse.documents.map((doc) => ({
        operationId,
        processingJobId,
        documentId: doc.documentId,
        documentType: doc.documentType,
        confidence: doc.confidence,
        originalFields: doc.fields,
        rawResponse: aiResponse,
    }));
    await createExtractions(dataArray);
};
export const getOperationExtractions = async (userId, operationId) => {
    await verifyOperationOwnership(userId, operationId);
    const extractions = await findExtractionsByOperationId(operationId);
    return extractions.map(toSafeExtraction);
};
export const verifyExtractionOwnership = async (userId, extractionId) => {
    const extraction = await findExtractionById(extractionId);
    if (!extraction) {
        throw new ApiError(404, 'Extraction not found.');
    }
    // Reuse operation ownership to ensure user owns this extraction
    await verifyOperationOwnership(userId, extraction.operationId);
    return extraction;
};
export const updateExtraction = async (userId, extractionId, data) => {
    const extraction = await verifyExtractionOwnership(userId, extractionId);
    if (extraction.status === 'APPROVED') {
        throw new ApiError(400, 'Approved extractions cannot be edited.');
    }
    const updated = await updateExtractionById(extractionId, {
        editedFields: data.editedFields !== undefined ? data.editedFields : extraction.editedFields,
        reviewerNotes: data.reviewerNotes !== undefined ? data.reviewerNotes : extraction.reviewerNotes,
        status: 'IN_REVIEW',
        reviewedAt: new Date(),
        version: { increment: 1 },
    });
    return toSafeExtraction(updated);
};
export const approveExtraction = async (userId, extractionId) => {
    const extraction = await verifyExtractionOwnership(userId, extractionId);
    if (extraction.status === 'APPROVED') {
        throw new ApiError(400, 'Extraction is already approved.');
    }
    const updated = await updateExtractionById(extractionId, {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
    });
    return toSafeExtraction(updated);
};
export const rejectExtraction = async (userId, extractionId, reason) => {
    const extraction = await verifyExtractionOwnership(userId, extractionId);
    if (extraction.status === 'APPROVED') {
        throw new ApiError(400, 'Approved extractions cannot be rejected.');
    }
    const updated = await updateExtractionById(extractionId, {
        status: 'REJECTED',
        reviewerNotes: reason || extraction.reviewerNotes,
    });
    return toSafeExtraction(updated);
};
//# sourceMappingURL=extraction.service.js.map