// export.controller.ts
import { exportExtractionToExcel, exportOperationToExcel } from './export.service.js';
import { ApiError } from '../../common/ApiError.js';
import logger from '../../config/logger.js';
export const exportExtractionHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: extractionId } = req.params;
        const { buffer, filename } = await exportExtractionToExcel(req.userId, extractionId);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // We use .end() to send the raw buffer
        res.status(200).end(buffer);
        logger.info({ extractionId }, 'Workbook download completed');
    }
    catch (error) {
        next(error);
    }
};
export const exportOperationHandler = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new ApiError(401, 'Authentication required.');
        const { id: operationId } = req.params;
        const { buffer, filename } = await exportOperationToExcel(req.userId, operationId);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // We use .end() to send the raw buffer
        res.status(200).end(buffer);
        logger.info({ operationId }, 'Operation workbook download completed');
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=export.controller.js.map