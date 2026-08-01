import type { AIExtractionRequest, AIExtractionResponse } from './ai.types.js';
export declare class AIClient {
    /**
     * Calls the external AI Backend to extract documents.
     * If the backend is unavailable or fails, returns a deterministic mock payload.
     */
    static extractDocuments(request: AIExtractionRequest): Promise<AIExtractionResponse>;
    /**
     * Generates a deterministic mock response for frontend development.
     */
    private static generateMockResponse;
}
//# sourceMappingURL=ai.client.d.ts.map