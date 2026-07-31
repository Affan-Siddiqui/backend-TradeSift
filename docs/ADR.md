# TradeSift Backend Architecture Decision Record (ADR)

**Project:** TradeSift Backend  
**Version:** MVP v1.0  
**Status:** Accepted  
**Last Updated:** July 2026

---

# 1. Purpose

TradeSift is a **document-to-ERP automation platform** built for **off-dock terminal operations**.

Its primary goal is to eliminate manual data entry during **Gate-In** and **Gate-Out** processes.

TradeSift is **not** an OCR product, document management system, or ERP. It acts as an intelligent automation layer between operational documents and terminal ERP/software.

The overall workflow is:

```
Operational Documents
        ↓
TradeSift
        ↓
Canonical Structured Data
        ↓
Customer ERP / Excel
```

---

# 2. MVP Scope

The MVP focuses on:

- User authentication (already implemented)
- Operation management
- Multi-document upload
- AI orchestration (mock initially)
- Structured data extraction
- Cross-document validation
- Human correction
- Configurable ERP field mapping
- Standardized API
- Configurable Excel export
- Audit logging

Out of scope:

- Organization / Multi-tenant support
- Direct ERP integrations
- Mapping versioning
- AI training
- AI model implementation
- Workflow customization
- Advanced formatting rules

---

# 3. Core Business Workflow

```
Create Operation
        ↓
Upload Required Documents
        ↓
Store Documents
        ↓
AI Extraction
        ↓
Canonical Data
        ↓
Cross Document Validation
        ↓
Human Corrections (if required)
        ↓
Approved Canonical Data
        ↓
Field Mapping
        ↓
API / Excel Delivery
        ↓
Operation Completed
        ↓
Deletion Policy
```

---

# 4. Architectural Principles

These principles must not be violated during MVP development.

## 4.1 Backend Owns Business Logic

The backend is responsible for:

- orchestration
- persistence
- validation
- mapping
- API contracts
- export generation

The frontend should never perform business logic.

---

## 4.2 AI Assists Only

The AI is responsible for:

- document classification
- extraction
- normalization
- confidence scoring
- conflict detection

The AI is **NOT** responsible for:

- business validation
- approval
- workflow decisions
- persistence

---

## 4.3 One Canonical Data Model

TradeSift stores extracted data in one canonical internal format.

Customer-specific field names are generated using mappings.

Internal data never changes based on customer ERP.

---

## 4.4 Stable API

TradeSift exposes one standardized API.

Customer differences are handled through configuration.

Never create customer-specific APIs.

---

## 4.5 Configuration Over Custom Code

Customer-specific behavior must be configurable.

Avoid hardcoded customer logic.

---

## 4.6 Modular Architecture

Every module must follow the existing architecture.

```
Routes
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
```

Business logic belongs only in Services.

Repositories contain only database operations.

Controllers remain thin.

---

# 5. Existing Backend

The authentication system is considered production-ready.

Existing modules:

- Auth
- Users
- Sessions
- Trusted Devices

These modules should **not** be modified unless absolutely necessary.

All new development extends the existing architecture.

---

# 6. Primary Business Entity

The primary business entity is:

## Operation

Everything belongs to an Operation.

```
Operation
    │
    ├── Documents
    ├── Processing Jobs
    ├── Extracted Data
    ├── Validation Results
    ├── Corrections
    ├── Audit Logs
    └── Exports
```

Operations represent either:

- Gate In
- Gate Out

---

# 7. User Isolation

For MVP:

Each user represents one terminal/customer.

All data is isolated by authenticated user.

Future versions will replace this with Organizations.

---

# 8. Document Processing

Operations may contain multiple documents.

TradeSift does not require predefined document sets.

Each terminal uploads whatever documents are required for its own workflow.

The AI and validation engine determine how to process those documents.

---

# 9. AI Integration

For MVP:

AI will be mocked.

The backend must be designed so the mock implementation can later be replaced with the production AI without changing business logic.

AI integration should occur through a dedicated abstraction layer.

---

# 10. Cross Document Validation

TradeSift validates extracted information across multiple uploaded documents.

Examples:

- Container Number
- BL Number
- Weight
- Consignee
- Shipper

Validation rules belong to the backend.

---

# 11. Human Corrections

Operators may edit extracted values.

TradeSift stores:

- original AI value
- corrected value
- user
- timestamp

Corrections become audit history.

Future versions may use them for AI improvement.

---

# 12. Field Mapping

TradeSift stores data internally using canonical field names.

Customers configure:

```
Canonical Field
        ↓
Customer ERP Field
```

Example:

```
containerNumber

↓

CNTR_NO
```

The same mapping powers:

- REST API
- Excel export

---

# 13. API Strategy

TradeSift exposes one standardized API.

Customers configure which fields they want.

The backend transforms canonical data into customer field names before returning data.

---

# 14. Excel Strategy

Excel exports use the same mapping engine.

Users can:

- choose fields
- save preferences
- reuse preferences
- modify preferences later

---

# 15. Audit Logging

All significant actions must be logged.

Examples:

- Operation Created
- Document Uploaded
- Processing Started
- Processing Completed
- Validation Failed
- Field Corrected
- Export Generated
- Operation Deleted

Audit logs should remain immutable.

---

# 16. Deletion Policy

Gate Out:

- delete immediately after completion

Gate In:

- if older than 45 days
- ask user before deletion

---

# 17. Technical Decisions

Backend:

- Node.js
- Express
- TypeScript

Database:

- MongoDB
- Prisma

Validation:

- Zod

Caching / Queue:

- Redis
- BullMQ

Storage:

- Cloudinary

Logging:

- Pino

Authentication:

- Existing implementation

---

# 18. Development Rules

Every phase must:

- follow existing architecture
- use existing ApiResponse
- use existing ApiError
- use existing middleware
- use existing logger
- use existing validation style

Never bypass Service layer.

Never access Prisma directly from Controllers.

Never duplicate existing utilities.

---

# 19. Implementation Strategy

Development is divided into independent phases.

Each phase should:

- implement only its scope
- remain production-ready
- avoid speculative architecture
- update `docs/backend-development.md`
- preserve backward compatibility

---

# 20. Future Architecture (Post-MVP)

Future enhancements may include:

- Organizations
- Multi-tenancy
- API Keys
- Mapping Versioning
- Direct ERP Connectors
- AI Learning
- Workflow Templates
- Advanced Formatting Rules
- Role-Based Access Control
- Organization Settings

These features are intentionally excluded from MVP.

---

# 21. Guiding Philosophy

TradeSift is not an AI product.

TradeSift is an automation platform.

AI is one component of the system.

The backend is the orchestration layer that converts unstructured operational documents into reliable, validated, configurable ERP-ready data.

Every architectural decision should support this objective.