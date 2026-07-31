# Phase 2: Document Management Walkthrough

This phase established the Document Management module for handling file uploads (currently using memory storage as placeholders) linked directly to operations.

## Completed Tasks

1. **Database Additions:**
   - Modified `prisma/schema.prisma` to include the new `Document` model.
   - Set up the relation between `Operation` and `Document`.
   - Created the `DocumentUploadStatus` enum (`UPLOADING`, `UPLOADED`, `FAILED`).
   - Ran `npx prisma db push` to synchronize the MongoDB schema.

2. **Middleware & Validation:**
   - Installed and configured `multer` using memory storage (`src/middleware/upload.middleware.ts`).
   - Implemented strict limits based on your feedback:
     - **Max File Size:** 10 MB.
     - **Allowed MIME Types:** PDF, JPG, JPEG, and PNG.
   - If an invalid file is uploaded, the backend rejects it and responds with a `400` Error before hitting the controller.

3. **Core Module (`src/modules/documents`):**
   - Created all required architectural components following the Phase 1 blueprint (Constants, Types, Schema, Repository, Service, Controller, Routes).
   - Enforced strict ownership checks via `verifyOperationOwnership`. If a user attempts to upload to an operation they don't own, the API safely responds with `404 Not Found`.

4. **API Endpoints:**
   - **Upload/List:** Seamlessly nested these routes into `src/modules/operations/operation.routes.ts`:
     - `POST /api/operations/:id/documents` (Supports `multipart/form-data`)
     - `GET /api/operations/:id/documents`
   - **View/Delete:** Kept standard endpoints in `document.routes.ts` mounted at the `/api` root:
     - `GET /api/documents/:id`
     - `DELETE /api/documents/:id`

5. **Documentation Synchronization:**
   - Appended Phase 2 implementation specifics to `docs/backend-development.md`.
   - Extended the `docs/API_REFERENCE.md` with complete documentation for all new document endpoints, including the required `multipart/form-data` format and specific response structures.

## Verification

- The project was strictly verified via `npx tsc` to ensure total TypeScript safety.
- The `req.userId` getter override pattern utilized during Phase 1 continues to behave predictably.
- The existing operations and auth routes remain untouched and functional.

## Notes for Phase 3

The upload workflow currently generates a UUID (`temp_<uuid>`) and passes the Buffer to memory. This decoupled design guarantees that Phase 3 (Storage) can easily inject Cloudinary uploads directly into the Service layer **without touching controllers, routing, or validation logic**.
