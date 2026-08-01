// export.schema.ts
import { z } from 'zod';
export const exportExtractionParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid extraction ID format'),
});
//# sourceMappingURL=export.schema.js.map