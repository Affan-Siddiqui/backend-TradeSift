# TradeSift — Backend Requirements & Frontend Integration Specification Document

This document outlines the architecture, database schemas, and API contracts required to connect the TradeSift React frontend to a robust, asynchronous document-processing backend. It serves as a specifications guide for a backend developer or AI agent (e.g., Antigravity) during integration.

---

## 1. Product Context & Operational Workflow

TradeSift acts as an **intelligent document-to-data automation layer** for Pakistan's off-dock terminal operators and customs-related operations. It bridges incoming operational documents (Commercial Invoices, Packing Lists, Weighment Slips, Bills of Lading, etc.) with the terminal operator's existing ERP or destination management systems.

The core pipeline is as follows:
```
Upload Document ➔ Queue & Async Processing ➔ AI/OCR Data Extraction ➔ Data Validation ➔ Human Review ➔ Canonical Structured Output ➔ ERP Mapping / Export
```

This specification details the APIs, models, and validation logic needed to replace the current frontend mock layers with production services.

---

## 2. Technology Stack & Directory Conventions

The current backend is a TypeScript project with the following profile:
* **Framework**: Express.js (v5)
* **Database**: MongoDB (via Prisma Client v5)
* **Validation**: Zod (v4)
* **Cache / Rate Limiting**: Redis (via ioredis)
* **Folder Structure**: Modular (`src/modules/[module-name]/` with separate `.routes.ts`, `.controller.ts`, `.service.ts`, and `.model.ts` files).

New features MUST adhere to this architecture.

---

## 3. Existing Authentication Boundary

The following components are **already implemented, integrated, and verified**. Do NOT modify or recreate them:
* User signup, login, OTP authentication, and password reset flows (`/api/auth/*`).
* Authenticated user session tracking (`/api/auth/me`).
* Dynamic user profile fetches (`/api/users/me`) to populate operator names and roles in header/sidebar blocks.

All new endpoints described below must require session cookies (`withCredentials: true`) and run through the existing user verification middleware.

---

## 4. Logical Domain Requirements

### A. Document Management & Ingestion
* **File Types**: Support `.pdf`, `.png`, `.jpg`, `.jpeg` up to 10MB.
* **Storage**: Files should be stored securely (e.g., AWS S3 or a local sandbox directory) and registered in the database with a unique hash to prevent duplicate uploads.
* **Workflow Association**: Each uploaded document must specify its operational context:
  * `operation`: `Import` | `Export`
  * `workflow`: `Gate-In` | `Gate-Out`

### B. Asynchronous Job Processing
AI parsing and OCR extraction are slow operations. The backend must handle ingestion asynchronously:
1. The frontend uploads a file.
2. The backend stores the file, creates a `ProcessingJob`, and returns a `jobId` immediately with status `queued`.
3. A background task runner (e.g., BullMQ or a simple redis-backed queue) processes the document using the AI OCR pipeline.
4. The frontend **polls** `/api/jobs/:id` (recommended for simplicity) or listens via WebSockets/SSE to track progress.

### C. AI/OCR Extraction & Dynamic Schema Mapping
Since different document types require different sets of fields, the database should support dynamic field definitions:
* **Commercial Invoice**: Gross weight, Invoice value, Importer name, Shipper, Origin port, HS code.
* **Weighment Slip**: Gross weight, Net weight, Container ID, Date/Time, Seal number.
* **Bill of Lading**: BL number, Vessel/Voyage, Port of Loading, Port of Discharge.

The extraction output must include:
* Field-level values and raw parsed coordinates.
* **Confidence scores** (e.g., float from `0.0` to `1.0`).

### D. Multi-Document Data Validation
The backend is responsible for verifying data consistency across the uploaded files for a shipment:
* **Container ID Check**: Ensure the container ID extracted from the Commercial Invoice matches the Weighment Slip and Bill of Lading.
* **Weight Mismatch**: Verify that Gross Weight matches between the Invoice and Packing List.
* **Missing Fields**: Highlight any mandatory fields (e.g., Consignee) that the AI could not detect.

### E. Human Review & State Transitions
The operator reviews extracted values in a two-column editor layout. The backend must support field correction updates and handle status state transitions:
* `UPLOADED` ➔ `QUEUED` ➔ `PROCESSING` ➔ `EXTRACTED` ➔ `NEEDS_REVIEW` (if confidence < 90% or validation fails) ➔ `VERIFIED` (upon operator correction and approval).

---

## 5. API Endpoint Contracts

All routes require authentication.

### `POST /api/documents/upload`
* **Purpose**: Ingests files and initializes async processing.
* **Request Header**: `Content-Type: multipart/form-data`
* **Request Body**:
  * `file`: (Binary File)
  * `operation`: `"Import"` | `"Export"`
  * `workflow`: `"Gate-In"` | `"Gate-Out"`
* **Success Response (`202 Accepted`)**:
  ```json
  {
    "success": true,
    "data": {
      "documentId": "DOC-90321",
      "fileName": "Invoice_CN_90321.pdf",
      "jobId": "JOB-88231",
      "status": "queued"
    }
  }
  ```

### `GET /api/jobs/:jobId`
* **Purpose**: Polls document OCR progress.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "jobId": "JOB-88231",
      "documentId": "DOC-90321",
      "status": "processing", // queued | processing | completed | failed
      "progress": 60,
      "error": null
    }
  }
  ```

### `GET /api/documents`
* **Purpose**: Lists all active documents in the repository with search and status filters.
* **Request Query Params**: `?search=HLXU&type=Commercial%2520Invoice&status=Needs%2520Review`
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "DOC-001",
        "name": "Invoice_INV-2026-00452.pdf",
        "type": "Commercial Invoice",
        "operation": "Import",
        "reference": "INV-2026-00452",
        "status": "Needs Review",
        "uploadedAt": "2026-07-29T01:40:00Z",
        "containerNumber": "MSCU1234567",
        "billOfLading": "BL-784512",
        "confidence": "78%"
      }
    ]
  }
  ```

### `GET /api/documents/:documentId/extraction`
* **Purpose**: Retrieves structured extraction details and section schemas for the review workspace.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "documentId": "DOC-001",
      "documentType": "Commercial Invoice",
      "fileName": "Invoice_INV-2026-00452.pdf",
      "status": "needs-review",
      "sections": [
        {
          "id": "shipment",
          "title": "Shipment Information",
          "fields": [
            { "id": "containerNumber", "label": "Container Number", "value": "MSCU1234567", "confidence": 0.98, "status": "verified" },
            { "id": "deliveryOrder", "label": "Delivery Order Number", "value": "DO-9012", "confidence": 0.65, "status": "needs-review", "message": "Low confidence matching value" }
          ]
        }
      ]
    }
  }
  ```

### `PUT /api/documents/:documentId/fields`
* **Purpose**: Saves corrected field values entered by the operator.
* **Request Body**:
  ```json
  {
    "fields": [
      { "id": "deliveryOrder", "value": "DO-KICT-9012" }
    ]
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Fields updated successfully."
  }
  ```

### `POST /api/documents/:documentId/validate`
* **Purpose**: Runs consistency checks across documents.
* **Success Response (`200 OK` - Validated)**:
  ```json
  {
    "success": true,
    "data": {
      "isValid": true,
      "message": "All fields verified. Document validated successfully!"
    }
  }
  ```
* **Success Response (`200 OK` - Validation Error)**:
  ```json
  {
    "success": true,
    "data": {
      "isValid": false,
      "message": "Container ID mismatch: Invoice states MSCU1234567, Weighment Slip states HLXU8902341",
      "invalidFields": ["containerNumber"]
    }
  }
  ```

### `GET /api/dashboard/stats`
* **Purpose**: Fetches aggregate metrics for the dashboard home screen.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "processedCount": 1284,
      "processingCount": 24,
      "reviewCount": 8,
      "issueCount": 3
    }
  }
  ```

---

## 6. Database Schema Design (Prisma Model Specification)

Configure these models in the Prisma schema to support the MongoDB document pipeline:

```prisma
model Document {
  id              String           @id @default(auto()) @map("_id") @db.ObjectId
  fileName        String
  fileUrl         String
  fileHash        String           @unique
  documentType    String           // Commercial Invoice, Packing List, etc.
  operation       String           // Import | Export
  workflow        String           // Gate-In | Gate-Out
  status          String           // UPLOADED, QUEUED, PROCESSING, EXTRACTED, NEEDS_REVIEW, VERIFIED, FAILED
  reference       String?
  containerNumber String?
  billOfLading    String?
  uploadedAt      DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  userId          String           @db.ObjectId
  user            User             @relation(fields: [userId], references: [id])
  sections        DocumentSection[]
  processingJobs  ProcessingJob[]
}

model DocumentSection {
  id          String           @id @default(auto()) @map("_id") @db.ObjectId
  title       String           // Shipment Information, Cargo Information, etc.
  documentId  String           @db.ObjectId
  document    Document         @relation(fields: [documentId], references: [id], onDelete: Cascade)
  fields      ExtractedField[]
}

model ExtractedField {
  id          String           @id @default(auto()) @map("_id") @db.ObjectId
  fieldKey    String           // containerNumber, hsCode, etc.
  label       String
  value       String
  confidence  Float            // 0.0 to 1.0
  status      String           // verified, needs-review, missing
  message     String?
  sectionId   String           @db.ObjectId
  section     DocumentSection  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
}

model ProcessingJob {
  id          String           @id @default(auto()) @map("_id") @db.ObjectId
  status      String           // queued, processing, completed, failed
  progress    Int              @default(0)
  error       String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  documentId  String           @db.ObjectId
  document    Document         @relation(fields: [documentId], references: [id], onDelete: Cascade)
}
```

---

## 7. Error Handling & Standard Responses

API errors must follow a uniform JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Required fields are empty or mismatched.",
    "details": [
      { "field": "containerNumber", "issue": "Missing matching value on weighment slip" }
    ]
  }
}
```

### Standard Error Codes:
* `INVALID_FILE`: Uploaded file corrupt or unreadable.
* `UNSUPPORTED_TYPE`: Mime type not in PDF/PNG/JPG list.
* `EXTRACTION_FAILED`: AI parser encountered timeout or classification failure.
* `LOW_CONFIDENCE`: Extraction complete but confidence scores fall below threshold rules.

---

## 8. Frontend ➔ Backend Responsibility Matrix

| Operational Task | Frontend Responsibility | Backend Responsibility |
|---|---|---|
| File Selection & Filtering | UI, size checking, file drag-and-drop triggers | None |
| File Storage & Management | Triggers POST request to upload endpoint | Stores binary file securely; saves file DB hashes |
| AI Data Extraction | Renders loading spinners, confidence labels | Coordinates OCR engine; returns coordinate keys |
| Validation Logic Checks | Alerts empty fields prior to validation click | Runs cross-document database mismatch lookups |
| Field Corrections | Displays input editor; triggers save updates | Saves manually input values; updates confidence flags |
| Data Export & Mapping | UI trigger actions; handles CSV downloads | Formulates clean canonical objects into Excel formats |

---

## 9. Implementation Guidance for Antigravity

When utilizing Antigravity to build these services, adhere to these sequential integration rules:

1. **Verify Database Connections**: Ensure Prisma is connected to the MongoDB server configured in the backend `.env` variables before adding models.
2. **Mount Modules Incrementally**: Use the existing module system directory pattern. Create `src/modules/documents/` and `src/modules/jobs/` modules.
3. **Keep AI Engine Decoupled**: Define interfaces for the extraction service (e.g., `extractionService.extractText()`) so that the AI OCR implementation remains decoupled from the Express route layers.
4. **Use Asynchronous Job Runners**: Implement simple job tracking routines using the Prisma `ProcessingJob` schema rather than executing OCR tasks synchronously within HTTP handler lifecycles.
5. **Enforce Rate Limits**: Apply rate limits to uploads using the existing Redis configs to safeguard storage resources.
6. **Do NOT Modify Authentication**: Ensure the auth wrapper hooks in the backend stay unmodified to protect user privacy routes.
