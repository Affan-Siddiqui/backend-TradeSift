// ---------- Trusted Device (Prisma) ----------
import prisma from "../../../prisma/client.js";
export const findTrustedDeviceByHash = async (hash) => {
    return prisma.trustedDevice.findUnique({ where: { trustedDeviceIdHash: hash } });
};
export const updateTrustedDeviceLastUsed = async (id) => {
    return prisma.trustedDevice.update({
        where: { id },
        data: {
            lastUsedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
    });
};
export const createTrustedDevice = async (data) => {
    return prisma.trustedDevice.create({ data });
};
export const countTrustedDevicesForUser = async (userId) => {
    return prisma.trustedDevice.count({ where: { userId } });
};
export const deleteLeastRecentlyUsedTrustedDevice = async (userId) => {
    const oldest = await prisma.trustedDevice.findFirst({
        where: { userId },
        orderBy: { lastUsedAt: 'asc' },
    });
    if (oldest) {
        await prisma.trustedDevice.delete({ where: { id: oldest.id } });
    }
};
export const deleteAllTrustedDevicesForUser = async (userId) => {
    return prisma.trustedDevice.deleteMany({ where: { userId } });
};
export const deleteAllTrustedDevicesGlobally = async () => {
    return prisma.trustedDevice.deleteMany({});
};
//# sourceMappingURL=trustedDevice.repository.js.map