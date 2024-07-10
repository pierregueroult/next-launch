import * as z from "zod";

const LoginSchema = z.object({
  email: z.string().email({
    message: "L'adresse email saisie n'est pas valide",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe saisie doit contenir au moins 8 caractères",
  }),
  code: z.optional(
    z.string().min(4, {
      message: "Le code saisie doit contenir au moins 4 caractères",
    }),
  ),
});

export default LoginSchema;
