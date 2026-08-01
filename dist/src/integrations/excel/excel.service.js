// excel.service.ts
import { buildWorkbook } from './excel.builder.js';
import logger from '../../config/logger.js';
export const generateExtractionWorkbook = async (data) => {
    try {
        const workbook = await buildWorkbook(data);
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to generate Excel workbook');
        throw error;
    }
};
//# sourceMappingURL=excel.service.js.map