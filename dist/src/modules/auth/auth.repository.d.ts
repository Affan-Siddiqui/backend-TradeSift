import type { PendingLoginData, PendingPasswordResetData, PendingRegistrationData } from './auth.types.js';
import type { CooldownType } from '@prisma/client';
export declare const setPendingRegistration: (email: string, data: PendingRegistrationData, ttlSeconds?: number) => Promise<void>;
export declare const getPendingRegistration: (email: string) => Promise<PendingRegistrationData | null>;
export declare const deletePendingRegistration: (email: string) => Promise<void>;
export declare const findUserByEmail: (email: string) => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
} | null>;
export declare const createUser: (data: {
    firstName: string;
    lastName: string;
    organisation?: string | null;
    email: string;
    password?: string;
}) => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
}>;
export declare const findCooldownRecord: (email: string, type: CooldownType) => Promise<{
    id: string;
    email: string;
    type: import(".prisma/client").$Enums.CooldownType;
    generationCount: number;
    lastGeneratedAt: Date | null;
    cooldownStage: number;
    cooldownUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const upsertCooldownRecord: (email: string, type: CooldownType, data: {
    generationCount: number;
    lastGeneratedAt: Date;
    cooldownStage: number;
    cooldownUntil: Date | null;
}) => Promise<{
    id: string;
    email: string;
    type: import(".prisma/client").$Enums.CooldownType;
    generationCount: number;
    lastGeneratedAt: Date | null;
    cooldownStage: number;
    cooldownUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteCooldownEmail: (email: string, type: CooldownType) => Promise<{
    id: string;
    email: string;
    type: import(".prisma/client").$Enums.CooldownType;
    generationCount: number;
    lastGeneratedAt: Date | null;
    cooldownStage: number;
    cooldownUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const setPendingLogin: (email: string, data: PendingLoginData, ttlSeconds?: number) => Promise<void>;
export declare const getPendingLogin: (email: string) => Promise<PendingLoginData | null>;
export declare const deletePendingLogin: (email: string) => Promise<void>;
export declare const findUserById: (id: string) => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
} | null>;
export declare const updateUserPassword: (id: string, hashedPassword: string) => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
}>;
export declare const setPendingPasswordReset: (email: string, data: PendingPasswordResetData, ttlSeconds?: number) => Promise<void>;
export declare const getPendingPasswordReset: (email: string) => Promise<PendingPasswordResetData | null>;
export declare const deletePendingPasswordReset: (email: string) => Promise<void>;
export declare const deleteAllCooldownRecords: () => Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=auth.repository.d.ts.map