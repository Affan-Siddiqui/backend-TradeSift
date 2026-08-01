// users.repository.ts
import prisma from '../../../prisma/client.js';
export const updateUserFields = async (userId, data) => {
    const { firstName, lastName, organisation } = data;
    const cleanedData = {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(organisation !== undefined && { organisation }),
    };
    return prisma.user.update({ where: { id: userId }, data: cleanedData });
};
export const deleteUserById = async (userId) => {
    return prisma.user.delete({ where: { id: userId } });
};
export const findAllUsers = async () => {
    return prisma.user.findMany();
};
export const deleteAllUsersRecords = async () => {
    return prisma.user.deleteMany({});
};
//# sourceMappingURL=user.repository.js.map