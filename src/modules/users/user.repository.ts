// users.repository.ts
import prisma from '../../../prisma/client.js';
import type { UpdateUserInput } from './user.schema.js';

export const updateUserFields = async (userId: string, data: UpdateUserInput) => {
  const { firstName, lastName, organisation } = data;

  const cleanedData: Record<string, string> = {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(organisation !== undefined && { organisation }),
  };
  
  return prisma.user.update({ where: { id: userId }, data: cleanedData });
};

export const deleteUserById = async (userId: string) => {
  return prisma.user.delete({ where: { id: userId } });
};

export const findAllUsers = async () => {
  return prisma.user.findMany();
};

export const deleteAllUsersRecords = async () => {
  return prisma.user.deleteMany({});
};