// excel.service.ts

import type { Buffer } from 'node:buffer';
import { buildWorkbook } from './excel.builder.js';
import type { ExcelExportData } from './excel.types.js';
import logger from '../../config/logger.js';

export const generateExtractionWorkbook = async (data: ExcelExportData): Promise<Buffer> => {
  try {
    const workbook = await buildWorkbook(data);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate Excel workbook');
    throw error;
  }
};
