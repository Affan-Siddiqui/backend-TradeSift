import type { UpdateUserInput } from './user.schema.js';
export declare const updateUserFields: (userId: string, data: UpdateUserInput) => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
}>;
export declare const deleteUserById: (userId: string) => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
}>;
export declare const findAllUsers: () => Promise<{
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    organisation: string | null;
    agreedToTermsAt: Date;
}[]>;
export declare const deleteAllUsersRecords: () => Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=user.repository.d.ts.map