export declare const findTrustedDeviceByHash: (hash: string) => Promise<{
    id: string;
    userId: string;
    trustedDeviceIdHash: string;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
} | null>;
export declare const updateTrustedDeviceLastUsed: (id: string) => Promise<{
    id: string;
    userId: string;
    trustedDeviceIdHash: string;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
}>;
export declare const createTrustedDevice: (data: {
    userId: string;
    trustedDeviceIdHash: string;
    expiresAt: Date;
}) => Promise<{
    id: string;
    userId: string;
    trustedDeviceIdHash: string;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
}>;
export declare const countTrustedDevicesForUser: (userId: string) => Promise<number>;
export declare const deleteLeastRecentlyUsedTrustedDevice: (userId: string) => Promise<void>;
export declare const deleteAllTrustedDevicesForUser: (userId: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const deleteAllTrustedDevicesGlobally: () => Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=trustedDevice.repository.d.ts.map