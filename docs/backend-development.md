# TradeSift Backend Development Journal

---

# Existing Architecture Summary

## Technology Stack

- **Runtime:** Node.js with TypeScript (ESM, `nodenext` module resolution)
- **Framework:** Express 5
- **Database:** MongoDB via Prisma ORM
- **Cache / Queue:** Redis (ioredis)
- **Validation:** Zod v4
- **Logging:** Pino with pino-pretty (dev)
- **Authentication:** JWT (access + refresh tokens via HTTP-only cookies)

## Project Structure

```
src/
├── app.ts                    # Express app setup (middleware, routes, error handling)
├── server.ts                 # Entry point (DB connect, listen, graceful shutdown)
├── common/                   # Shared classes
│   ├── ApiResponse.ts        # Standard success response wrapper
│   ├── ApiError.ts           # Custom error class with statusCode
│   ├── constants.ts          # Shared constants
│   └── enums.ts              # Shared enums
├── config/                   # Configuration
│   ├── env.ts                # Zod-validated environment variables
│   ├── logger.ts             # Pino logger instance
│   ├── redis.ts              # Redis connection
│   ├── mail.ts               # Nodemailer transport
│   └── google.ts             # Google OAuth client
├── middleware/                # Express middleware
│   ├── auth.middleware.ts     # requireAuth (JWT cookie verification)
│   ├── validation.middleware.ts  # validate (body), validateQuery (query)
│   ├── error.middleware.ts    # Global error handler
│   ├── notFound.middleware.ts # 404 catch-all
│   ├── requestLogger.middleware.ts # Request logging
│   └── rateLimit.middleware.ts # Rate limiting
├── modules/                   # Feature modules
│   ├── auth/                  # Authentication (register, login, OTP, Google OAuth, passwords)
│   ├── users/                 # User profile CRUD
│   ├── sessions/              # Session management
│   ├── trusted-devices/       # Trusted device management
│   └── operations/            # Operations CRUD (Phase 1)
├── routes/
│   └── index.ts               # Central route registration
└── utils/                     # Utility functions
    ├── cookies.ts             # Cookie helpers
    ├── crypto.ts              # Crypto utilities
    ├── date.ts                # Date utilities
    ├── hash.ts                # Hashing utilities
    ├── jwt.ts                 # JWT sign/verify
    └── otp.ts                 # OTP generation
```

## Architecture Pattern

Every module follows:

```
Routes → Controller → Service → Repository → Prisma
```

- **Routes:** Define HTTP endpoints, apply middleware (auth, validation)
- **Controllers:** Thin handlers — check auth, call service, return ApiResponse
- **Services:** All business logic, ownership checks, validation
- **Repositories:** Pure Prisma data-access functions (no business logic)

## Module File Convention

Each module contains up to 7 files:

```
module/
├── module.constants.ts   # Module-specific constants
├── module.types.ts       # TypeScript interfaces
├── module.schema.ts      # Zod validation schemas + inferred types
├── module.repository.ts  # Prisma data access
├── module.service.ts     # Business logic
├── module.controller.ts  # Express handlers
└── module.routes.ts      # Route definitions
```

---

# Coding Standards

1. **ESM imports:** All local imports use `.js` extension (e.g., `./auth.service.js`)
2. **Type imports:** Use `import type` for type-only imports (required by `verbatimModuleSyntax`)
3. **Exported functions:** Use `export const functionName = async (...)` pattern (not classes)
4. **Error handling:** Controllers wrap logic in try/catch → `next(err)`
5. **Errors:** Always throw `new ApiError(statusCode, message)` — never raw errors
6. **Responses:** Always return `new ApiResponse(message, data)` with appropriate HTTP status
7. **Authentication check:** Controllers verify `req.userId` exists before proceeding
8. **Zod v4:** Use `message` property for custom error messages (not `required_error` / `invalid_type_error`)
9. **Prisma access:** Only through repository functions, never directly in services or controllers
10. **Naming:** camelCase for functions/variables, PascalCase for types/interfaces/classes

---

# Development Rules

1. Read `docs/ADR.md` before every phase
2. Read this file (`docs/backend-development.md`) before every phase
3. Read `docs/API_REFERENCE.md` before every phase
4. Never bypass the Routes → Controller → Service → Repository → Prisma flow
5. Business logic belongs **only** in Services
6. Repositories contain **only** database operations
7. Controllers remain thin
8. Use existing `ApiResponse`, `ApiError`, middleware, logger — never duplicate
9. Every operation belongs to exactly one user — ownership enforced in Service layer
10. Do not modify Auth, Users, Sessions, Trusted Devices modules unless absolutely required
11. Every phase must update both this file and `API_REFERENCE.md`
12. A phase is not complete until documentation is updated

---

# Phase Log

## Phase 1 — Operations Module

**Completed:** July 2026

### Summary

Implemented the Operations module — the primary business entity in TradeSift. Operations represent Gate-In or Gate-Out workflows. Full CRUD with strict user-scoped data isolation.

### Files Added

| File | Purpose |
|------|---------|
| `src/modules/operations/operation.constants.ts` | Pagination defaults, allowed status transitions |
| `src/modules/operations/operation.types.ts` | SafeOperation and PaginatedOperations interfaces |
| `src/modules/operations/operation.schema.ts` | Zod schemas for create, update, params, query |
| `src/modules/operations/operation.repository.ts` | Prisma data access (CRUD + count) |
| `src/modules/operations/operation.service.ts` | Business logic with ownership enforcement |
| `src/modules/operations/operation.controller.ts` | Thin Express handlers |
| `src/modules/operations/operation.routes.ts` | Route definitions with auth + validation middleware |

### Files Modified

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `OperationType` enum, `OperationStatus` enum, `Operation` model |
| `src/routes/index.ts` | Registered `/operations` routes |
| `src/middleware/validation.middleware.ts` | Added `validateQuery()` middleware for query parameter validation |

### Database Changes

- Added `OperationType` enum: `GATE_IN`, `GATE_OUT`
- Added `OperationStatus` enum: `DRAFT`, `PROCESSING`, `REVIEW`, `COMPLETED`, `CANCELLED`
- Added `Operation` collection with fields: `id`, `userId`, `operationType`, `status`, `referenceNo`, `notes`, `createdAt`, `updatedAt`

### Routes Added

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/operations` | Create operation |
| GET | `/api/operations` | List operations (paginated) |
| GET | `/api/operations/:id` | Get single operation |
| PATCH | `/api/operations/:id` | Update operation |
| DELETE | `/api/operations/:id` | Delete operation |

### Important Decisions

1. **All lifecycle states in enum now:** `OperationStatus` includes `PROCESSING`, `REVIEW`, `COMPLETED` even though Phase 1 only uses `DRAFT` and `CANCELLED`. This avoids a breaking Prisma migration in future phases.
2. **Ownership returns 404:** When a user tries to access another user's operation, the API returns `404 Operation not found` — not `403 Forbidden`. This prevents information leakage about the existence of other users' operations.
3. **Status transitions enforced:** The service layer validates status transitions against `ALLOWED_STATUS_TRANSITIONS`. Phase 1 only allows `DRAFT → CANCELLED`.
4. **Hard delete for Phase 1:** `DELETE /operations/:id` performs a hard delete. Future phases will implement soft delete / scheduled cleanup per the ADR deletion policy.
5. **validateQuery middleware added:** The existing `validate()` middleware only validated `req.body`. Added `validateQuery()` for query parameter validation (pagination, filters).

### Assumptions

- Operations in `DRAFT` status can be deleted
- No rate limiting on operation endpoints beyond what Express applies globally
- No soft delete needed yet — the ADR deletion policy will be implemented in a future phase
- `referenceNo` is a free-text field (not validated for uniqueness or format)

### Known Limitations

- No documents, AI processing, or workflow transitions beyond DRAFT → CANCELLED
- No audit logging (future phase)
- No soft delete / scheduled deletion (future phase)
- No search or advanced filtering beyond operationType and status
- `userId` is not indexed separately on the Operation collection (Prisma + MongoDB may benefit from an explicit index in production)

### Notes for Future Phases

- **Phase 2 (Documents):** Will add a `documents` relation to the Operation model. The Operation model was designed to accommodate this without breaking changes.
- **Status transitions:** Expand `ALLOWED_STATUS_TRANSITIONS` in `operation.constants.ts` as workflow states become active.
- **Audit logging:** Every operation mutation (create, update, delete) should eventually emit an audit event.
- **Soft delete:** Add `deletedAt` field to Operation model for the ADR deletion policy.
- **Indexing:** Consider adding a compound index on `{ userId, createdAt }` for production performance.
