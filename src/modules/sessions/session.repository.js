import prisma from "../../../prisma/client.js";
// ---------- Session (Prisma) ----------
export const createSession = async (data) => {
    return prisma.session.create({ data });
};
export const deleteSessionByRefreshTokenHash = async (hash) => {
    return prisma.session.deleteMany({ where: { refreshTokenHash: hash } });
};
export const deleteAllSessionsForUser = async (userId) => {
    return prisma.session.deleteMany({ where: { userId } });
};
export const findSessionByRefreshTokenHash = async (hash) => {
    return prisma.session.findUnique({ where: { refreshTokenHash: hash } });
};
export const updateSessionRefreshToken = async (sessionId, data) => {
    return prisma.session.update({
        where: { id: sessionId },
        data: { ...data, lastUsedAt: new Date() },
    });
};
export const countSessionsForUser = async (userId) => {
    return prisma.session.count({ where: { userId } });
};
export const deleteLeastRecentlyUsedSession = async (userId) => {
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
//# sourceMappingURL=session.repository.js.map