// auth.repository.ts
import prisma from '../../../prisma/client.js';
import redis from '../../config/redis.js';
import {
  PENDING_REGISTRATION_KEY_PREFIX,
  PENDING_REGISTRATION_TTL_SECONDS,
  PENDING_LOGIN_KEY_PREFIX,
  OTP_EXPIRY_SECONDS

} from './auth.constants.js';
import type { PendingLoginData, PendingPasswordResetData, PendingRegistrationData } from './auth.types.js';
import type { CooldownType } from '@prisma/client';

// ---------- Pending Registration (Redis) ----------

const pendingRegistrationKey = (email: string) =>
  `${PENDING_REGISTRATION_KEY_PREFIX}${email}`;

export const setPendingRegistration = async (
  email: string,
  data: PendingRegistrationData,
  ttlSeconds: number = PENDING_REGISTRATION_TTL_SECONDS
): Promise<void> => {
  await redis.set(
    pendingRegistrationKey(email),
    JSON.stringify(data),
    'EX',
    ttlSeconds
  );
};

export const getPendingRegistration = async (
  email: string
): Promise<PendingRegistrationData | null> => {
  const raw = await redis.get(pendingRegistrationKey(email));
  if (!raw) return null;
  return JSON.parse(raw) as PendingRegistrationData;
};

export const deletePendingRegistration = async (email: string): Promise<void> => {
  await redis.del(pendingRegistrationKey(email));
};

// ---------- User (Prisma) ----------

export const findUserByEmail = async (email: string) => {
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

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  organisation?: string | null;
  email: string;
  password?: string; // already hashed by service layer
}) => {
  return prisma.user.create({ 
     data: {
      firstName: data.firstName,
      lastName: data.lastName, 
      organisation: data.organisation ?? null,
      email: data.email,
      password: data.password? data.password : null,
    },
   });
};


// ---------- CoolDownEmail (Prisma) ----------

export const findCooldownRecord = async (email: string, type: CooldownType) => {
  return prisma.coolDownEmail.findUnique({
    where: { email_type: { email, type } },
  });
};

export const upsertCooldownRecord = async (
  email: string,
  type: CooldownType,
  data: {
    generationCount: number;
    lastGeneratedAt: Date;
    cooldownStage: number;
    cooldownUntil: Date | null;
  }
) => {
  return prisma.coolDownEmail.upsert({
    where: { email_type: { email, type } },
    create: { email, type, ...data },
    update: { ...data },
  });
};

export const deleteCooldownEmail = async (email: string, type: CooldownType) => {
  return prisma.coolDownEmail.delete({ where: { email_type: { email, type } } });
}



// ---------- Pending Login (Redis) ----------

const pendingLoginKey = (email: string) =>`${PENDING_LOGIN_KEY_PREFIX}${email}`;

export const setPendingLogin = async (
  email: string,
  data: PendingLoginData,
  ttlSeconds: number = OTP_EXPIRY_SECONDS
): Promise<void> => {
  await redis.set(pendingLoginKey(email), JSON.stringify(data), 'EX', ttlSeconds);
};

export const getPendingLogin = async (email: string): Promise<PendingLoginData | null> => {
  const raw = await redis.get(pendingLoginKey(email));
  return raw ? (JSON.parse(raw) as PendingLoginData) : null;
};

export const deletePendingLogin = async (email: string): Promise<void> => {
  await redis.del(pendingLoginKey(email));
};




// ---------- User (Prisma) ----------
export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUserPassword = async (id: string, hashedPassword: string) => {
  return prisma.user.update({ where: { id }, data: { password: hashedPassword } });
};


// ---------- Pending Password Reset (Redis) ----------
const pendingPasswordResetKey = (email: string) => `pending_password_reset:${email}`;

export const setPendingPasswordReset = async (
  email: string,
  data: PendingPasswordResetData,
  ttlSeconds: number = OTP_EXPIRY_SECONDS
): Promise<void> => {
  await redis.set(pendingPasswordResetKey(email), JSON.stringify(data), 'EX', ttlSeconds);
};

export const getPendingPasswordReset = async (
  email: string
): Promise<PendingPasswordResetData | null> => {
  const raw = await redis.get(pendingPasswordResetKey(email));
  return raw ? (JSON.parse(raw) as PendingPasswordResetData) : null;
};

export const deletePendingPasswordReset = async (email: string): Promise<void> => {
  await redis.del(pendingPasswordResetKey(email));
};

