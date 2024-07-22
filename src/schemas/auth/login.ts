import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Login.EmailInvalid",
  }),
  password: z.string().min(8, {
    message: "Login.PasswordTooShort",
  }),
  code: z.optional(
    z.string().length(6, {
      message: "Login.CodeTooShort",
    }),
  ),
});

export type LoginSchema = z.infer<typeof loginSchema>;
