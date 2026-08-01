import type { CreateSessionInput, UpdateSessionRefreshTokenInput } from "./session.types.js";
export declare const createSession: (data: CreateSessionInput) => Promise<{
    id: string;
    userId: string;
    refreshTokenHash: string;
    trustedDeviceId: string | null;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
}>;
export declare const deleteSessionByRefreshTokenHash: (hash: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const deleteAllSessionsForUser: (userId: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const findSessionByRefreshTokenHash: (hash: string) => Promise<{
    id: string;
    userId: string;
    refreshTokenHash: string;
    trustedDeviceId: string | null;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
} | null>;
export declare const updateSessionRefreshToken: (sessionId: string, data: UpdateSessionRefreshTokenInput) => Promise<{
    id: string;
    userId: string;
    refreshTokenHash: string;
    trustedDeviceId: string | null;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
}>;
export declare const countSessionsForUser: (userId: string) => Promise<number>;
export declare const deleteLeastRecentlyUsedSession: (userId: string) => Promise<void>;
export declare const deleteAllSessionsGlobally: () => Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=session.repository.d.ts.map