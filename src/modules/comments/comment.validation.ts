import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string(),
  taskId: z.string().uuid(),
  createdBy: z.string().uuid(),
});

export const getAllCommentsSchema = z.object({
  taskId: z.string().uuid(),
  limit: z.number().int().positive().default(10),
  skip: z.number().int().default(0),
});

export const deleteCommentSchema = z.object({
  id: z.string().uuid(),
});

export type CreateCommentPayload = z.infer<typeof createCommentSchema>;
export type GetAllCommentsPayload = z.infer<typeof getAllCommentsSchema>;
