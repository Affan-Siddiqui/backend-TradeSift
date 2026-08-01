import type { Buffer } from 'node:buffer';
export declare const exportExtractionToExcel: (userId: string, extractionId: string) => Promise<{
    buffer: Buffer;
    filename: string;
}>;
export declare const exportOperationToExcel: (userId: string, operationId: string) => Promise<{
    buffer: Buffer;
    filename: string;
}>;
//# sourceMappingURL=export.service.d.ts.map