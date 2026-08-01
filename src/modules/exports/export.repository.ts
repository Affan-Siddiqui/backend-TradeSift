// export.repository.ts

import prisma from '../../../prisma/client.js';

export const updateExtractionExportStats = async (id: string) => {
  return prisma.extraction.update({
    where: { id },
    data: {
      exportCount: { increment: 1 },
      lastExportedAt: new Date(),
    },
  });
};
