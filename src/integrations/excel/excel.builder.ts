// excel.builder.ts

import ExcelJS from 'exceljs';
import { DEFAULT_SHEET_NAME, DEFAULT_WORKBOOK_CREATOR, HEADER_STYLES } from './excel.constants.js';
import type { ExcelExportData } from './excel.types.js';

export const buildWorkbook = async (data: ExcelExportData): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = DEFAULT_WORKBOOK_CREATOR;
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(DEFAULT_SHEET_NAME);

  sheet.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 50 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.font = HEADER_STYLES.font;
    cell.fill = HEADER_STYLES.fill;
  });

  const flattenValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const flattenObject = (obj: Record<string, any>, prefix = ''): { field: string; value: string }[] => {
    let rows: { field: string; value: string }[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        rows = rows.concat(flattenObject(value, fieldName));
      } else {
        rows.push({
          field: fieldName,
          value: flattenValue(value),
        });
      }
    }
    return rows;
  };

  const rows = flattenObject(data.fields);
  sheet.addRows(rows);

  return workbook;
};
