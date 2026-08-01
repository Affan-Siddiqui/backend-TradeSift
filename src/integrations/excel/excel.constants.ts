// excel.constants.ts

export const DEFAULT_SHEET_NAME = 'Extraction Data';
export const DEFAULT_WORKBOOK_CREATOR = 'TradeSift';

export const HEADER_STYLES = {
  font: { bold: true },
  fill: {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFD3D3D3' },
  },
};
