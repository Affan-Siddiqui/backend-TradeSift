export interface CreateSessionInput {
    userId: string;
    refreshTokenHash: string;
    trustedDeviceId: string | null;
    expiresAt: Date;
}
export interface UpdateSessionRefreshTokenInput {
    refreshTokenHash: string;
    expiresAt: Date;
}
//# sourceMappingURL=session.types.d.ts.map