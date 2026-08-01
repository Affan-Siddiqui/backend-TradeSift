// extraction.schema.ts
import { z } from 'zod';
export const extractionIdParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid extraction ID format'),
});
export const updateExtractionSchema = z.object({
    editedFields: z.record(z.string(), z.any()).optional(),
    reviewerNotes: z.string().optional(),
}).refine((data) => data.editedFields || data.reviewerNotes, {
    message: 'Either editedFields or reviewerNotes must be provided',
});
export const rejectExtractionSchema = z.object({
    reason: z.string().optional(),
});
//# sourceMappingURL=extraction.schema.js.map