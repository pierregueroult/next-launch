import { z } from "zod";

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const symbolRegex = /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/;

export const registerSchema = z.object({
  email: z.string().email({
    message: "Register.InvalidEmail",
  }),
  password: z
    .string()
    .min(8, {
      message: "Register.PasswordTooShort",
    })
    .refine((password) => password.match(uppercaseRegex), { message: "Register.PasswordComplexity.Uppercase" })
    .refine((password) => password.match(lowercaseRegex), { message: "Register.PasswordComplexity.Lowercase" })
    .refine((password) => password.match(numberRegex), { message: "Register.PasswordComplexity.Number" })
    .refine((password) => password.match(symbolRegex), { message: "Register.PasswordComplexity.Symbol" })
    .refine((password) => password.length >= 8, { message: "Register.PasswordComplexity.Character" }),
  name: z.string().min(3, {
    message: "Register.NameTooShort",
  }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
