import z from "zod";

// users.schema.ts
export const updateUserSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  organisation: z.string().trim().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;