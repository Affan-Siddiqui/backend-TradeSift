import { z } from 'zod';
export declare const extractionIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const updateExtractionSchema: z.ZodObject<{
    editedFields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    reviewerNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const rejectExtractionSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=extraction.schema.d.ts.map