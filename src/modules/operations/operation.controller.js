// operation.controller.ts
import { ApiResponse } from '../../common/ApiResponse.js';
import { ApiError } from '../../common/ApiError.js';
import { createNewOperation, getOperation, listOperations, updateExistingOperation, deleteExistingOperation, } from './operation.service.js';
export const createOperation = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const input = req.body;
        const operation = await createNewOperation(req.userId, input);
        res.status(201).json(new ApiResponse('Operation created.', operation));
    }
    catch (err) {
        next(err);
    }
};
export const getOperationById = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id } = req.params;
        const operation = await getOperation(req.userId, id);
        res.status(200).json(new ApiResponse('Operation fetched.', operation));
    }
    catch (err) {
        next(err);
    }
};
export const listUserOperations = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const query = req.query;
        const result = await listOperations(req.userId, query);
        res.status(200).json(new ApiResponse('Operations fetched.', result));
    }
    catch (err) {
        next(err);
    }
};
export const updateOperation = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id } = req.params;
        const input = req.body;
        const operation = await updateExistingOperation(req.userId, id, input);
        res.status(200).json(new ApiResponse('Operation updated.', operation));
    }
    catch (err) {
        next(err);
    }
};
export const deleteOperation = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id } = req.params;
        await deleteExistingOperation(req.userId, id);
        res.status(200).json(new ApiResponse('Operation deleted.', null));
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=operation.controller.js.map