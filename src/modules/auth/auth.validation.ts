import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);
const passwordSchema = z.string().trim().min(1);

export const registerSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1).max(255),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterPayloadType = z.infer<typeof registerSchema>;
export type LoginPayloadType = z.infer<typeof loginSchema>;
