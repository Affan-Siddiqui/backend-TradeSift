export interface JwtPayload {
    userId: string;
}
export declare const signAccessToken: (payload: JwtPayload) => string;
export declare const signRefreshToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map