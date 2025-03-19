import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1),
  createdBy: z.string().uuid(),
});

export const getAllOrganizationsSchema = z.object({
  name: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  limit: z.number().int().positive().default(10),
  skip: z.number().int().default(0),
});

export const getOrganizationSchema = z.object({
  id: z.string().uuid(),
});

export const updateOrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  createdBy: z.string().uuid(),
});

export type CreateOrganizationPayload = z.infer<
  typeof createOrganizationSchema
>;
export type GetAllOrganizationsPayload = z.infer<
  typeof getAllOrganizationsSchema
>;
export type UpdateOrganizationPayload = z.infer<
  typeof updateOrganizationSchema
>;
