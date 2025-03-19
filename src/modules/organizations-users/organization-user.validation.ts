import { z } from "zod";

export const addUserToOrganizationSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  createdBy: z.string().uuid(),
});

export const removeUserFromOrganizationSchema = addUserToOrganizationSchema;

export type AddUserToOrganizationPayload = z.infer<
  typeof addUserToOrganizationSchema
>;
