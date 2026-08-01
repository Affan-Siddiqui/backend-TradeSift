// auth.repository.ts
import prisma from '../../../prisma/client.js';
import redis from '../../config/redis.js';
import { PENDING_REGISTRATION_KEY_PREFIX, PENDING_REGISTRATION_TTL_SECONDS, PENDING_LOGIN_KEY_PREFIX, OTP_EXPIRY_SECONDS } from './auth.constants.js';
// ---------- Pending Registration (Redis) ----------
const pendingRegistrationKey = (email) => `${PENDING_REGISTRATION_KEY_PREFIX}${email}`;
export const setPendingRegistration = async (email, data, ttlSeconds = PENDING_REGISTRATION_TTL_SECONDS) => {
    await redis.set(pendingRegistrationKey(email), JSON.stringify(data), 'EX', ttlSeconds);
};
export const getPendingRegistration = async (email) => {
    const raw = await redis.get(pendingRegistrationKey(email));
    if (!raw)
        return null;
    return JSON.parse(raw);
};
export const deletePendingRegistration = async (email) => {
    await redis.del(pendingRegistrationKey(email));
};
// ---------- User (Prisma) ----------
export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
        // select: {
        //   id: true,
        //   email: true,
        //   firstName: true,
        //   lastName: true,
        //   organisation: true
        // },
    });
};
export const createUser = async (data) => {
    return prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            organisation: data.organisation ?? null,
            email: data.email,
            password: data.password ? data.password : null,
        },
    });
};
// ---------- CoolDownEmail (Prisma) ----------
export const findCooldownRecord = async (email, type) => {
    return prisma.coolDownEmail.findUnique({
        where: { email_type: { email, type } },
    });
};
export const upsertCooldownRecord = async (email, type, data) => {
    return prisma.coolDownEmail.upsert({
        where: { email_type: { email, type } },
        create: { email, type, ...data },
        update: { ...data },
    });
};
export const deleteCooldownEmail = async (email, type) => {
    return prisma.coolDownEmail.delete({ where: { email_type: { email, type } } });
};
// ---------- Pending Login (Redis) ----------
const pendingLoginKey = (email) => `${PENDING_LOGIN_KEY_PREFIX}${email}`;
export const setPendingLogin = async (email, data, ttlSeconds = OTP_EXPIRY_SECONDS) => {
    await redis.set(pendingLoginKey(email), JSON.stringify(data), 'EX', ttlSeconds);
};
export const getPendingLogin = async (email) => {
    const raw = await redis.get(pendingLoginKey(email));
    return raw ? JSON.parse(raw) : null;
};
export const deletePendingLogin = async (email) => {
    await redis.del(pendingLoginKey(email));
};
// ---------- User (Prisma) ----------
export const findUserById = async (id) => {
    return prisma.user.findUnique({ where: { id } });
};
export const updateUserPassword = async (id, hashedPassword) => {
    return prisma.user.update({ where: { id }, data: { password: hashedPassword } });
};
// ---------- Pending Password Reset (Redis) ----------
const pendingPasswordResetKey = (email) => `pending_password_reset:${email}`;
export const setPendingPasswordReset = async (email, data, ttlSeconds = OTP_EXPIRY_SECONDS) => {
    await redis.set(pendingPasswordResetKey(email), JSON.stringify(data), 'EX', ttlSeconds);
};
export const getPendingPasswordReset = async (email) => {
    const raw = await redis.get(pendingPasswordResetKey(email));
    return raw ? JSON.parse(raw) : null;
};
export const deletePendingPasswordReset = async (email) => {
    await redis.del(pendingPasswordResetKey(email));
};
export const deleteAllCooldownRecords = async () => {
    return prisma.coolDownEmail.deleteMany({});
};
//# sourceMappingURL=auth.repository.js.map