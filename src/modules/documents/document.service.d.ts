import type { SafeDocument, SafeDocumentWithOperation } from './document.types.js';
export declare const uploadDocuments: (userId: string, operationId: string, files: Express.Multer.File[]) => Promise<SafeDocument[]>;
export declare const listOperationDocuments: (userId: string, operationId: string) => Promise<SafeDocument[]>;
export declare const listAllUserDocuments: (userId: string) => Promise<SafeDocumentWithOperation[]>;
export declare const getDocument: (userId: string, documentId: string) => Promise<SafeDocument>;
export declare const deleteExistingDocument: (userId: string, documentId: string) => Promise<void>;
//# sourceMappingURL=document.service.d.ts.map