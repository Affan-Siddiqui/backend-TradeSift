import type { SafeExtraction } from './extraction.types.js';
import type { Extraction } from '@prisma/client';
import type { AIExtractionResponse } from '../../integrations/ai/ai.types.js';
export declare const saveExtractions: (operationId: string, processingJobId: string, aiResponse: AIExtractionResponse) => Promise<void>;
export declare const getOperationExtractions: (userId: string, operationId: string) => Promise<SafeExtraction[]>;
export declare const verifyExtractionOwnership: (userId: string, extractionId: string) => Promise<Extraction>;
export declare const updateExtraction: (userId: string, extractionId: string, data: {
    editedFields?: Record<string, any>;
    reviewerNotes?: string;
}) => Promise<SafeExtraction>;
export declare const approveExtraction: (userId: string, extractionId: string) => Promise<SafeExtraction>;
export declare const rejectExtraction: (userId: string, extractionId: string, reason?: string) => Promise<SafeExtraction>;
//# sourceMappingURL=extraction.service.d.ts.map