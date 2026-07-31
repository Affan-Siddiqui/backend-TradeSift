# TradeSift Backend Development Journal

---

## 1. System Architecture Overview

TradeSift is a document-to-ERP automation platform built for off-dock terminals. The backend acts as the orchestration and business logic layer. 

### Technology Stack
- **Runtime:** Node.js with TypeScript (ESM, `nodenext` module resolution)
- **Framework:** Express 5
- **Database:** MongoDB via Prisma ORM
- **Cache / Queue:** Redis (ioredis)
- **Validation:** Zod v4
- **Logging:** Pino with pino-pretty (dev environment)
- **Authentication:** JWT (access + refresh tokens via HTTP-only cookies) + OTP / Google OAuth

---

## 2. Database Schema (MongoDB via Prisma)

The database consists of the following core collections:

1. **User**: Core identity. Stores email, hashed password, name, and organization details.
2. **Session**: Tracks active refresh tokens to manage multi-device logins and remote logout.
3. **TrustedDevice**: Tracks recognized devices using hashed device IDs to bypass restrictive security flows.
4. **CoolDownEmail**: Manages rate-limiting and cooldown periods for OTPs (Register, Login, Forgot Password).
5. **Operation**: *(Phase 1)* Represents a Gate-In or Gate-Out workflow belonging to a user. Supports statuses (`DRAFT`, `PROCESSING`, `REVIEW`, `COMPLETED`, `CANCELLED`).

---

## 3. Core Modules (Foundation)

Before feature development began, a robust foundation was established across four core security and identity modules:

### A. Auth Module (`src/modules/auth`)
Handles all authentication flows:
- **Registration & Login**: Uses an OTP-based flow or Password-based flow.
- **Google OAuth**: Integrated login via Google.
- **Token Management**: Issues HTTP-only `access_token` and `refresh_token` cookies.
- **Security**: Integrates with Trusted Devices to prevent unauthorized logins from new devices.

### B. Users Module (`src/modules/users`)
Handles user profile management.
- Enforces strict isolation: users can only fetch or update their own profiles.

### C. Sessions Module (`src/modules/sessions`)
- Every login creates a `Session` in MongoDB containing a hash of the refresh token.
- Allows users to view active sessions across devices and revoke them remotely.

### D. Trusted Devices Module (`src/modules/trusted-devices`)
- Devices are fingerprinted on the frontend and tracked here.
- Unrecognized devices require additional OTP verification before a session is granted.

---

## 4. Architecture Pattern & Conventions

Every module follows a strict 5-layer pattern:

```
Routes → Controller → Service → Repository → Prisma
```

- **Routes:** Define HTTP endpoints and apply middleware (`requireAuth`, `validate`, `validateQuery`, `validateParams`).
- **Controllers:** Thin handlers. Extract data from `req`, call the Service layer, and return standard `ApiResponse` objects. Errors are passed to `next(err)`.
- **Services:** Contains **ALL** business logic, status transitions, and data ownership checks (`userId` validation).
- **Repositories:** Pure Prisma data-access functions. No business logic.
- **Validation (Zod):** Request bodies, queries, and params are strictly validated using Zod v4 schemas. 

### Express 5 Gotchas
- **Getter Overrides:** In Express 5, `req.query` and `req.params` are read-only getters. To override them with sanitized Zod output in middlewares, we use `Object.defineProperty`:
  ```typescript
  Object.defineProperty(req, 'params', { value: result.data, writable: true, enumerable: true, configurable: true });
  ```
- **Zod v4 Error Messages:** Zod v4 uses the `message` property for custom errors (replacing v3's `required_error` and `invalid_type_error`).

---

## 5. Phase Log

### Phase 1 — Operations Module
**Completed:** July 2026

**Summary:** 
Implemented the Operations module — the primary business entity in TradeSift. Full CRUD with strict user-scoped data isolation.

**Key Endpoints:**
- `POST /api/operations` — Create operation (`GATE_IN` or `GATE_OUT`).
- `GET /api/operations` — List operations (paginated, filterable).
- `GET /api/operations/:id` — Get single operation.
- `PATCH /api/operations/:id` — Update operation or cancel (`status: CANCELLED`).
- `DELETE /api/operations/:id` — Hard delete operation.

**Important Decisions & Fixes:**
1. **Ownership returns 404:** When a user tries to access another user's operation, the API returns `404 Not Found` rather than `403 Forbidden` to prevent information leakage.
2. **MongoDB ObjectID Validation:** A `validateParams()` middleware was added to enforce strict 24-character hex regex validation on `:id` routes. This prevents Prisma from throwing `500 P2023` errors when malformed IDs are provided.
3. **Enum Forward-Planning:** The `OperationStatus` Prisma enum includes `PROCESSING`, `REVIEW`, and `COMPLETED` for future phases, even though Phase 1 only uses `DRAFT` and `CANCELLED`.
### Phase 2 — Document Management
**Completed:** July 2026

**Summary:** 
Implemented the Document Management module for uploading and listing operational documents. Multer memory storage is used along with a temporary `temp_<uuid>` storageKey to prepare for Phase 3 external storage.

**Files Added:**
- `src/middleware/upload.middleware.ts`
- `src/modules/documents/*` (constants, types, schema, repository, service, controller, routes)

**Files Modified:**
- `prisma/schema.prisma` (Added `Document` and `DocumentUploadStatus`)
- `src/modules/operations/operation.routes.ts` (Added nested document routes)
- `src/routes/index.ts` (Mounted `/documents`)

**Database Changes:**
- **`Document`** model added with relation to `Operation`.
- **`DocumentUploadStatus`** enum added (`UPLOADING`, `UPLOADED`, `FAILED`).

**Routes Added:**
- `POST /api/operations/:id/documents` — Upload a document to an operation (multipart/form-data).
- `GET /api/operations/:id/documents` — List documents for an operation.
- `GET /api/documents/:id` — Get document metadata.
- `DELETE /api/documents/:id` — Delete document metadata.

**Design Decisions:**
1. **Placeholder Storage:** Documents are not yet uploaded to external storage. Multer uses memory storage, and the backend generates a `temp_<uuid>` placeholder for the `storageKey`. This decouples the business logic from Cloudinary (which will be added in Phase 3).
2. **File Validation:** Configurable max size of 10MB and strict MIME type checking (PDF, JPEG, JPG, PNG) is enforced via Multer.
3. **Route Nesting vs Root:** The upload and list operations are nested under `operation.routes.ts` (`/:id/documents`) because they conceptually map an action on an Operation, while fetch/delete actions are mapped directly to `/documents/:id` in `document.routes.ts`.

**Recommendations (Future):**
- Add soft deletes and scheduled deletion cron tasks for orphaned documents or expired operations.

---

## 6. Future Phases & Next Steps

- **Phase 3 (Storage):** Implement Cloudinary integration to replace placeholder storage.
- **AI Processing Layer:** Integration with external AI processing queues (document classification, data extraction).
- **Audit Logging:** Every operation mutation (create, update, delete) will eventually emit an audit event.
- **Soft Deletes:** Implement an ADR-compliant deletion policy (adding `deletedAt` and background cron cleanup).
