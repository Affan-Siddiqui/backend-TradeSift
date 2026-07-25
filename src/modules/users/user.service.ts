import { ApiError } from "../../common/ApiError.js";
import { deleteAllCooldownRecords, findUserById } from "../auth/auth.repository.js";
import { deleteAllSessionsForUser, deleteAllSessionsGlobally } from "../sessions/session.repository.js";
import { deleteAllTrustedDevicesForUser, deleteAllTrustedDevicesGlobally } from "../trusted-devices/trustedDevice.repository.js";
import { updateUserFields, deleteUserById, findAllUsers, deleteAllUsersRecords } from "./user.repository.js";
import type { UpdateUserInput } from "./user.schema.js";
import type { safeUser } from "./user.types.js";

const toSafeUser = (user: safeUser) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  organisation: user.organisation,
});

export const getUserProfile = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return toSafeUser(user);
};

export const updateUserProfile = async (userId: string, input: UpdateUserInput) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found.');

  const updated = await updateUserFields(userId, input);
  return toSafeUser(updated);
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found.');

  await deleteAllSessionsForUser(userId);
  await deleteAllTrustedDevicesForUser(userId);
  await deleteUserById(userId);
};

// TEMP: testing-only
export const getAllUsersList = async () => {
  const users = await findAllUsers();
  return users.map(toSafeUser);
};

// TEMP: testing-only
// users.service.ts

export const deleteAllUsersData = async (): Promise<void> => {
  await deleteAllSessionsGlobally();
  await deleteAllTrustedDevicesGlobally();
  await deleteAllCooldownRecords();
  await deleteAllUsersRecords();
};