import { passwordSchema } from "./password";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
