// ai.types.ts

export interface AIDocumentInput {
  documentId: string;
  url: string;
}

export interface AIExtractionRequest {
  operationId: string;
  documents: AIDocumentInput[];
}

export interface AIExtractedField {
  [key: string]: any;
}

export interface AIDocumentResult {
  documentId: string;
  documentType: string;
  confidence: number;
  fields: AIExtractedField;
}

export interface AIExtractionResponse {
  status: string;
  documents: AIDocumentResult[];
}
