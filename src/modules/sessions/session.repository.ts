
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

export const countSessionsForUser = async (userId: string) => {
  return prisma.session.count({ where: { userId } });
};

export const deleteLeastRecentlyUsedSession = async (userId: string) => {
  const oldest = await prisma.session.findFirst({
    where: { userId },
    orderBy: { lastUsedAt: 'asc' },
  });
  if (oldest) {
    await prisma.session.delete({ where: { id: oldest.id } });
  }
};

export const deleteAllSessionsGlobally = async () => {
  return prisma.session.deleteMany({});
};
