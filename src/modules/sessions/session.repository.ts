
import prisma from "../../../prisma/client.js";
import type { CreateSessionInput, UpdateSessionRefreshTokenInput } from "./session.types.js";


// ---------- Session (Prisma) ----------
export const createSession = async (data: CreateSessionInput) => {
  return prisma.session.create({ data });
};

export const deleteSessionByRefreshTokenHash = async (hash: string) => {
  return prisma.session.deleteMany({ where: { refreshTokenHash: hash } });
};

export const deleteAllSessionsForUser = async (userId: string) => {
  return prisma.session.deleteMany({ where: { userId } });
};


export const findSessionByRefreshTokenHash = async (hash: string) => {
  return prisma.session.findUnique({ where: { refreshTokenHash: hash } });
};

export const updateSessionRefreshToken = async (
  sessionId: string,
  data: UpdateSessionRefreshTokenInput
) => {
  return prisma.session.update({
    where: { id: sessionId },
    data: { ...data, lastUsedAt: new Date() },
  });
};


