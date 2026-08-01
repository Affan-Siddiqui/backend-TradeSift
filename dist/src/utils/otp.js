// utils/otp.ts
import { randomInt } from 'crypto';
import { OTP_LENGTH } from '../modules/auth/auth.constants.js';
export const generateOtp = () => {
    const min = 10 ** (OTP_LENGTH - 1);
    const max = 10 ** OTP_LENGTH - 1;
    return randomInt(min, max + 1).toString();
};
//# sourceMappingURL=otp.js.map