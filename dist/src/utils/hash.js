import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export const hashPassword = async (plain) => {
    return bcrypt.hash(plain, SALT_ROUNDS);
};
export const comparePassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
//# sourceMappingURL=hash.js.map