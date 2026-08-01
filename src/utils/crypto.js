import { randomBytes, createHash } from 'crypto';
export const generateRandomToken = (bytes = 32) => {
    return randomBytes(bytes).toString('hex');
};
export const hashToken = (token) => {
    return createHash('sha256').update(token).digest('hex');
};
//# sourceMappingURL=crypto.js.map