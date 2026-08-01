import type { Response } from 'express';
export declare const setAccessTokenCookie: (res: Response, token: string) => void;
export declare const setRefreshTokenCookie: (res: Response, token: string) => void;
export declare const setTrustedDeviceCookie: (res: Response, id: string) => void;
export declare const clearAuthCookies: (res: Response) => void;
//# sourceMappingURL=cookies.d.ts.map