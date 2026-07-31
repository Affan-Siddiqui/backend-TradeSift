# Phase 2: Document Management Module

## Goal
Implement the Document Management module for TradeSift. This establishes the `Document` business entity, allowing users to upload documents and attach them to their operations. The actual file storage (e.g., Cloudinary) will be mocked out in this phase using Multer memory storage and temporary placeholder keys. AI processing is out of scope.

## Open Questions
- Is a 10MB default file size limit acceptable for testing document uploads?
- The backend uses `nodenext` for module resolution. Are there any known issues with Multer versions and ESM that I should be aware of, or should I just install the latest `multer` and `@types/multer`?

## Proposed Changes

### Dependencies
- Install `multer` as a production dependency and `@types/multer` as a dev dependency to handle `multipart/form-data`.

### Database Schema (Prisma)
- **[MODIFY]** `prisma/schema.prisma`
  - Add `DocumentUploadStatus` enum (`UPLOADING`, `UPLOADED`, `FAILED`).
  - Add `Document` model:
    - `id` (ObjectID)
    - `operationId` (ObjectID, relation to Operation)
    - `userId` (ObjectID)
    - `originalFileName` (String)
    - `mimeType` (String)
    - `fileSize` (Int)
    - `storageKey` (String)
    - `uploadStatus` (DocumentUploadStatus)
    - `createdAt` / `updatedAt` (DateTime)
  - Add `documents Document[]` relation to the `Operation` model.

### Documents Module (`src/modules/documents`)
- **[NEW]** `document.constants.ts`
  - Define `ALLOWED_MIME_TYPES` (e.g., `application/pdf`, `image/jpeg`, `image/png`, `image/jpg`).
  - Define `MAX_FILE_SIZE` limit (e.g., 10MB).
- **[NEW]** `document.types.ts`
  - TypeScript interfaces for safe responses.
- **[NEW]** `document.schema.ts`
  - Zod schemas for param validation (e.g., `documentIdParamSchema`, `operationIdParamSchema`).
- **[NEW]** `document.repository.ts`
  - Pure Prisma functions (`createDocument`, `getDocumentsByOperation`, `getDocumentById`, `deleteDocument`).
- **[NEW]** `document.service.ts`
  - Business logic:
    - Enforce ownership: Check if user owns the operation before allowing upload.
    - Generate mock `storageKey` (e.g., `temp_<uuid>`).
    - Save metadata with status `UPLOADED`.
    - Fetch and delete document logic (with ownership checks).
- **[NEW]** `document.controller.ts`
  - Thin handlers to process Multer's `req.file`, delegate to `document.service.ts`, and return `ApiResponse`.
- **[NEW]** `document.routes.ts`
  - Set up Multer with `memoryStorage` and limits/fileFilter.
  - Define endpoints:
    - `POST /operations/:operationId/documents` (upload file)
    - `GET /operations/:operationId/documents` (list)
    - `GET /documents/:id` (fetch single metadata)
    - `DELETE /documents/:id` (delete metadata)

### Route Registration
- **[MODIFY]** `src/routes/index.ts`
  - Mount `documentRoutes` to handle both `/api/operations/:operationId/documents` and `/api/documents/:id`.

### Documentation
- **[MODIFY]** `docs/backend-development.md`: Append Phase 2 log, decisions, and assumptions.
- **[MODIFY]** `docs/API_REFERENCE.md`: Document new Document endpoints including multipart/form-data payload instructions.

## Verification Plan
1. **Automated compilation:** Run `npx tsc --noEmit` and `prisma validate`.
2. **Schema Push:** Run `npx prisma db push` and verify client generation.
3. **Manual Verification:** Start server and use Postman/curl to:
   - Create an Operation.
   - Upload a PDF/JPG to the operation.
   - Upload an unsupported file (e.g., `.txt`) and ensure it is rejected.
   - Test ownership (try to view/delete documents of another user).
   - Ensure the `storageKey` is mocked with a placeholder.
