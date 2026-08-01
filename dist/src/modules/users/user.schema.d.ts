import z from "zod";
export declare const updateUserSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    organisation: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=user.schema.d.ts.map