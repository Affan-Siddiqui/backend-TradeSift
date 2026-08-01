// operation.constants.ts
export const OPERATIONS_DEFAULT_PAGE_SIZE = 10;
export const OPERATIONS_MAX_PAGE_SIZE = 50;
// Phase 1: only DRAFT → CANCELLED is allowed
// Future phases will expand this map as workflow transitions are implemented
export const ALLOWED_STATUS_TRANSITIONS = {
    DRAFT: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['REVIEW', 'FAILED', 'CANCELLED'],
};
//# sourceMappingURL=operation.constants.js.map