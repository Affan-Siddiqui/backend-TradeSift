import { z } from 'zod';
export declare const documentIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type DocumentIdParam = z.infer<typeof documentIdParamSchema>;
//# sourceMappingURL=document.schema.d.ts.map