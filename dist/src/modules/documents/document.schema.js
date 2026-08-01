// document.schema.ts
import { z } from 'zod';
export const documentIdParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Document ID format'),
});
//# sourceMappingURL=document.schema.js.map