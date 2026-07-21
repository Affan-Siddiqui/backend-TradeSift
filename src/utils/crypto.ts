import { randomBytes, createHash } from 'crypto';

export const generateRandomToken = (bytes = 32): string => {
  return randomBytes(bytes).toString('hex');
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};