import { z } from "zod";

export const createProjectSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  createdBy: z.string().uuid(),
});

export const updateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  createdBy: z.string().uuid(),
});

export const getAllProjectsSchema = z.object({
  name: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  limit: z.number().int().positive().default(10),
  skip: z.number().int().default(0),
});

export const getProjectSchema = z.object({
  id: z.string().uuid(),
});

export type CreateProjectPayload = z.infer<typeof createProjectSchema>;
export type UpdateProjectPayload = z.infer<typeof updateProjectSchema>;
export type GetAllProjectsPayload = z.infer<typeof getAllProjectsSchema>;
