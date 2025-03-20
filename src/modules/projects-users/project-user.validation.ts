import { z } from "zod";

export const addUserToProjectSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  createdBy: z.string().uuid(),
});

export const removeUserFromProjectSchema = addUserToProjectSchema;

export type AddUserToProjectPayload = z.infer<typeof addUserToProjectSchema>;
export type RemoveUserFromProjectPayload = z.infer<
  typeof removeUserFromProjectSchema
>;
