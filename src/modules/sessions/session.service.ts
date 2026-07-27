import { ApiError } from "../../common/ApiError.js";
import { generateRandomToken, hashToken } from "../../utils/crypto.js";
import { signAccessToken, verifyRefreshToken } from "../../utils/jwt.js";
import logger from '../../config/logger.js';
import { MAX_CONCURRENT_SESSIONS } from "./session.constants.js";
import { countSessionsForUser, createSession, deleteLeastRecentlyUsedSession, deleteSessionByRefreshTokenHash, findSessionByRefreshTokenHash, updateSessionRefreshToken } from "./session.repository.js";

export const issueSessionAndTokens = async (userId: string, trustedDeviceId?: string) => {
  const sessionCount = await countSessionsForUser(userId);
  if (sessionCount >= MAX_CONCURRENT_SESSIONS) {
    await deleteLeastRecentlyUsedSession(userId);
  }
  
  const accessToken = signAccessToken({ userId });
  const rawRefreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(rawRefreshToken);

  await createSession({
    userId,
    refreshTokenHash,
    trustedDeviceId: trustedDeviceId ?? null,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });
  logger.info({ userId, trustedDeviceId }, 'Session created');

  return { accessToken, refreshToken: rawRefreshToken };
};


// ---------- Refresh Token ----------
export const rotateRefreshToken = async (refreshTokenCookie: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshTokenCookie);
  } catch (err) {
    const staleHash = hashToken(refreshTokenCookie);
    await deleteSessionByRefreshTokenHash(staleHash);
    logger.warn({ err }, 'Refresh token verification failed');
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const currentHash = hashToken(refreshTokenCookie);
  const session = await findSessionByRefreshTokenHash(currentHash);

  if (!session) {
    throw new ApiError(401, 'Session not found. Please log in again.');
  }

  if (session.expiresAt < new Date()) {
    await deleteSessionByRefreshTokenHash(currentHash);
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const newAccessToken = signAccessToken({ userId: payload.userId });
  const newRawRefreshToken = generateRandomToken();
  const newRefreshTokenHash = hashToken(newRawRefreshToken);

  await updateSessionRefreshToken(session.id, {
    refreshTokenHash: newRefreshTokenHash,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccessToken, refreshToken: newRawRefreshToken };
};