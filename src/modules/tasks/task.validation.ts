import { z } from "zod";
import { TaskPriority, TaskStatus } from "./task.enum";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().uuid(),
  assignedTo: z.string().uuid().optional().nullable(),
  createdBy: z.string().uuid(),
});

export const getAllTasksSchema = z.object({
  title: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedTo: z.string().uuid().optional().nullable(),
  limit: z.number().int().positive().default(10),
  skip: z.number().int().default(0),
  createdBy: z.string().uuid(),
});

export const getTaskSchema = z.object({
  id: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  createdBy: z.string().uuid(),
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
});

export type CreateTaskPayload = z.infer<typeof createTaskSchema>;
export type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;
export type DeleteTaskPayload = z.infer<typeof deleteTaskSchema>;
export type GetAllTasksPayload = z.infer<typeof getAllTasksSchema>;
