import * as z from "zod";

const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "L'adresse email saisie n'est pas valide",
    }),
    password: z.string().min(8, {
      message: "Le mot de passe saisie doit contenir au moins 8 caractères",
    }),
    name: z.string().min(3, {
      message: "Le nom saisie doit contenir au moins 3 caractères",
    }),
  })
  .superRefine(({ password }, checkPasswordComplexity) => {
    const uppercase: boolean = /[A-Z]/.test(password);
    const lowerCase: boolean = /[a-z]/.test(password);
    const number: boolean = /\d/.test(password);
    const symbol: boolean = /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(password);
    if (!uppercase || !lowerCase || !number || !symbol) {
      let message = "";
      if (uppercase) {
        message = "Le mot de passe doit contenir au moins une majuscule";
      } else if (lowerCase) {
        message = "Le mot de passe doit contenir au moins une minuscule";
      } else if (number) {
        message = "Le mot de passe doit contenir au moins un chiffre";
      } else if (symbol) {
        message = "Le mot de passe doit contenir au moins un symbole";
      } else {
        message = "Le mot de passe doit contenir au moins un caractère";
      }
      return checkPasswordComplexity.addIssue({
        code: "custom",
        message,
      });
    }
    return true;
  });

export default RegisterSchema;
