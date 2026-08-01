import type { UpdateUserInput } from "./user.schema.js";
export declare const getUserProfile: (userId: string) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organisation: string | null;
}>;
export declare const updateUserProfile: (userId: string, input: UpdateUserInput) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organisation: string | null;
}>;
export declare const deleteUserAccount: (userId: string) => Promise<void>;
export declare const getAllUsersList: () => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organisation: string | null;
}[]>;
export declare const deleteAllUsersData: () => Promise<void>;
//# sourceMappingURL=user.service.d.ts.map