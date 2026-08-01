export declare const issueSessionAndTokens: (userId: string, trustedDeviceId?: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const rotateRefreshToken: (refreshTokenCookie: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
//# sourceMappingURL=session.service.d.ts.map