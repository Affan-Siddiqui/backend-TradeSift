// export.service.ts

import type { Buffer } from 'node:buffer';
import { ApiError } from '../../common/ApiError.js';
import { verifyExtractionOwnership } from '../extractions/extraction.service.js';
import { updateExtractionExportStats } from './export.repository.js';
import { generateExtractionWorkbook } from '../../integrations/excel/excel.service.js';
import logger from '../../config/logger.js';

export const exportExtractionToExcel = async (
  userId: string,
  extractionId: string
): Promise<{ buffer: Buffer; filename: string }> => {
  logger.info({ extractionId }, 'Export requested');

  // Verify extraction exists and belongs to the user via parent operation
  const extraction = await verifyExtractionOwnership(userId, extractionId);

  // Business rule: Only APPROVED extractions can be exported in Phase 7
  if (extraction.status !== 'APPROVED') {
    logger.warn({ extractionId, status: extraction.status }, 'Export failed: Extraction not approved');
    throw new ApiError(409, 'Only APPROVED extractions can be exported.');
  }

  // Use editedFields, fallback to originalFields. Type assert to Record<string, any>
  const exportData = (extraction.editedFields || extraction.originalFields) as Record<string, any>;

  // Generate the workbook
  const buffer = await generateExtractionWorkbook({ fields: exportData });
  logger.info({ extractionId }, 'Workbook generated');

  // Update export stats
  await updateExtractionExportStats(extractionId);

  const filename = `TradeSift_Extraction_${extractionId}.xlsx`;

  return { buffer, filename };
};
