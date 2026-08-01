export declare const DEFAULT_AI_TIMEOUT_MS = 30000;
/**
 * Deterministic mock response for a single document fallback.
 * Generates the same response for frontend consistency.
 */
export declare const getMockExtractionResponse: (documentId: string) => {
    documentId: string;
    documentType: string;
    confidence: number;
    fields: {
        invoiceNumber: string;
        containerNumber: string;
        grossWeight: number;
        shipper: string;
        consignee: string;
    };
};
//# sourceMappingURL=ai.constants.d.ts.map