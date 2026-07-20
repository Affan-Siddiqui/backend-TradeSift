// auth.repository.ts
import prisma from '../../../prisma/client.js';
import redis from '../../config/redis.js';
import {
  PENDING_REGISTRATION_KEY_PREFIX,
  PENDING_REGISTRATION_TTL_SECONDS,
} from './auth.constants.js';
import type { PendingRegistrationData } from './auth.types.js';

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
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  organisation?: string | null;
  email: string;
  password: string; // already hashed by service layer
}) => {
  return prisma.user.create({ 
     data: {
      firstName: data.firstName,
      lastName: data.lastName, 
      organisation: data.organisation ?? null,
      email: data.email,
      password: data.password,
    },
   });
};


// ---------- CoolDownEmail (Prisma) ----------

export const findCooldownRecord = async (email: string) => {
  return prisma.coolDownEmail.findUnique({ where: { email } });
};

export const upsertCooldownRecord = async (
  email: string,
  data: {
    generationCount: number;
    lastGeneratedAt: Date;
    cooldownStage: number;
    cooldownUntil: Date | null;
  }
) => {
  return prisma.coolDownEmail.upsert({
    where: { email },
    create: { email, ...data },
    update: { ...data },
  });
};

export const deleteCooldownEmail = async (email: string) => {
  return prisma.coolDownEmail.delete({ where: { email } });
}