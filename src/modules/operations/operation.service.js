// operation.service.ts
import { ApiError } from '../../common/ApiError.js';
import { createOperation, findOperationById, findOperationsByUserId, countOperationsByUserId, updateOperationById, deleteOperationById, } from './operation.repository.js';
import { ALLOWED_STATUS_TRANSITIONS } from './operation.constants.js';
// ---------- Helpers ----------
const toSafeOperation = (op) => ({
    id: op.id,
    userId: op.userId,
    operationType: op.operationType,
    status: op.status,
    referenceNo: op.referenceNo,
    notes: op.notes,
    createdAt: op.createdAt,
    updatedAt: op.updatedAt,
});
/**
 * Fetches an operation and verifies ownership.
 * Returns 404 for both "not found" and "not owned" to prevent information leakage.
 */
const findOwnedOperation = async (userId, operationId) => {
    const operation = await findOperationById(operationId);
    if (!operation || operation.userId !== userId) {
        throw new ApiError(404, 'Operation not found.');
    }
    return operation;
};
// ---------- Create ----------
export const createNewOperation = async (userId, input) => {
    const operation = await createOperation({
        userId,
        operationType: input.operationType,
        referenceNo: input.referenceNo ?? null,
        notes: input.notes ?? null,
    });
    return toSafeOperation(operation);
};
// ---------- Get One ----------
export const getOperation = async (userId, operationId) => {
    const operation = await findOwnedOperation(userId, operationId);
    return toSafeOperation(operation);
};
// ---------- List ----------
export const listOperations = async (userId, query) => {
    const { page, limit, operationType, status } = query;
    const skip = (page - 1) * limit;
    const filters = {
        ...(operationType !== undefined && { operationType }),
        ...(status !== undefined && { status }),
    };
    const [operations, total] = await Promise.all([
        findOperationsByUserId(userId, filters, { skip, take: limit }),
        countOperationsByUserId(userId, filters),
    ]);
    return {
        operations: operations.map(toSafeOperation),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
// ---------- Update ----------
export const updateExistingOperation = async (userId, operationId, input) => {
    const operation = await findOwnedOperation(userId, operationId);
    // Validate status transition if status is being changed
    if (input.status !== undefined) {
        const allowed = ALLOWED_STATUS_TRANSITIONS[operation.status];
        if (!allowed || !allowed.includes(input.status)) {
            throw new ApiError(400, `Cannot transition from ${operation.status} to ${input.status}.`);
        }
    }
    const updateData = {};
    if (input.referenceNo !== undefined)
        updateData.referenceNo = input.referenceNo;
    if (input.notes !== undefined)
        updateData.notes = input.notes;
    if (input.status !== undefined)
        updateData.status = input.status;
    const updated = await updateOperationById(operationId, updateData);
    return toSafeOperation(updated);
};
// ---------- Delete ----------
export const deleteExistingOperation = async (userId, operationId) => {
    await findOwnedOperation(userId, operationId);
    await deleteOperationById(operationId);
};
//# sourceMappingURL=operation.service.js.map