// document.types.ts

import type { DocumentUploadStatus } from '@prisma/client';

export interface SafeDocument {
  id: string;
  operationId: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  uploadStatus: DocumentUploadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeDocumentWithOperation extends SafeDocument {
  operation: {
    id: string;
    referenceNo: string | null;
    operationType: string;
    status: string;
  };
}
