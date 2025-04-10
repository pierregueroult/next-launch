import { passwordSchema } from "./password";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
