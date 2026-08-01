import { startProcessing, getOperationProcessingStatus } from './processing.service.js';
import { ApiResponse } from '../../common/ApiResponse.js';
import { ApiError } from '../../common/ApiError.js';
export const startProcessingHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: operationId } = req.params;
        const job = await startProcessing(req.userId, operationId);
        return res.status(201).json(new ApiResponse('Processing job queued successfully.', job));
    }
    catch (error) {
        next(error);
    }
};
export const getOperationProcessingStatusHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: operationId } = req.params;
        const job = await getOperationProcessingStatus(req.userId, operationId);
        return res.status(200).json(new ApiResponse('Processing status fetched.', job));
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=processing.controller.js.map