// extraction.types.ts

import type { Extraction, ExtractionStatus } from '@prisma/client';

export interface SafeExtraction {
  id: string;
  operationId: string;
  processingJobId: string;
  documentId: string;
  documentType: string;
  confidence: number;
  originalFields: Record<string, any>;
  editedFields: Record<string, any> | null;
  rawResponse: Record<string, any> | null;
  status: ExtractionStatus;
  approvedBy: string | null;
  approvedAt: Date | null;
  reviewedAt: Date | null;
  reviewerNotes: string | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
