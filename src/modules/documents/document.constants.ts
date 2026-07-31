// document.constants.ts

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = [
  // PDF
  'application/pdf',

  // Word
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

  // Excel
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/heic',
  'image/heif',
];

export const MAX_UPLOAD_FILES = 20;
