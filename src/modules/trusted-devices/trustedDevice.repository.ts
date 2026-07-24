// ---------- Trusted Device (Prisma) ----------

import prisma from "../../../prisma/client.js";

export const findTrustedDeviceByHash = async (hash: string) => {
  return prisma.trustedDevice.findUnique({ where: { trustedDeviceIdHash: hash } });
};

export const updateTrustedDeviceLastUsed = async (id: string) => {
  return prisma.trustedDevice.update({ where: { id }, data: { lastUsedAt: new Date() } });
};

export const createTrustedDevice = async (data: {
  userId: string;
  trustedDeviceIdHash: string;
  expiresAt: Date;
}) => {
  return prisma.trustedDevice.create({ data });
};

export const countTrustedDevicesForUser = async (userId: string) => {
  return prisma.trustedDevice.count({ where: { userId } });
};

export const deleteLeastRecentlyUsedTrustedDevice = async (userId: string) => {
  const oldest = await prisma.trustedDevice.findFirst({
    where: { userId },
    orderBy: { lastUsedAt: 'asc' },
  });
  if (oldest) {
    await prisma.trustedDevice.delete({ where: { id: oldest.id } });
  }
};

export const deleteAllTrustedDevicesForUser = async (userId: string) => {
  return prisma.trustedDevice.deleteMany({ where: { userId } });
};
