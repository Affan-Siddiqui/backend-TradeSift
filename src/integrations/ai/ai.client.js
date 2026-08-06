// ai.client.ts
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';
import { DEFAULT_AI_TIMEOUT_MS, getMockExtractionResponse } from './ai.constants.js';
import { AIBackendError } from './ai.errors.js';
export class AIClient {
    /**
     * Calls the external AI Backend to extract documents.
     * If the backend is unavailable or fails, returns a deterministic mock payload.
     */
    static async extractDocuments(request) {
        const { operationId, documents } = request;
        if (!env.AI_BACKEND_URL) {
            logger.warn({ operationId }, 'AI_BACKEND_URL not configured. Using mock extraction response.');
            return AIClient.generateMockResponse(documents);
        }
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), env.AI_BACKEND_TIMEOUT || DEFAULT_AI_TIMEOUT_MS);
            const headers = {
                'Content-Type': 'application/json',
            };
            // if (env.AI_BACKEND_API_KEY) {
            //     headers['Authorization'] = `Bearer ${env.AI_BACKEND_API_KEY}`;
            // }
            const response = await fetch(`${env.AI_BACKEND_URL}/extract`, {
                method: 'POST',
                headers,
                body: JSON.stringify(request),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new AIBackendError(`AI Backend responded with status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            logger.warn({ operationId, error: error.message }, 'AI Backend unavailable or failed. Using mock extraction response.');
            return AIClient.generateMockResponse(documents);
        }
    }
    /**
     * Generates a deterministic mock response for frontend development.
     */
    static generateMockResponse(documents) {
        return {
            status: 'completed',
            documents: documents.map(doc => getMockExtractionResponse(doc.documentId)),
        };
    }
}
//# sourceMappingURL=ai.client.js.map