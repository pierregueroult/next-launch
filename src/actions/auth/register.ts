"use server";

import { User, VerificationToken } from "@/db/types";
import send from "@/emails/send";
import { verificationEmail } from "@/emails/templates/verification-email";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema, registerSchema } from "@/schemas/auth/register";
import { createUser, getUserByEmail } from "@/services/user";
import bcrypt from "bcryptjs";

const register = async (values: RegisterSchema) => {
  const fields = registerSchema.safeParse(values);
  if (!fields.success) return { error: fields.error.message };

  const { email, password, name } = fields.data;

  const user: User | null = await getUserByEmail(email);
  if (user) return { error: "Ce compte existe déjà" };

  const hashedPassword: string = await bcrypt.hash(password, 10);

  await createUser(name, email, hashedPassword);

  const token: VerificationToken = await generateVerificationToken(email);

  await send({
    to: email,
    subject: "Verify your email",
    template: await verificationEmail({ email: token.email, token: token.token }),
  });

  return { success: "Un email de vérification vous a été envoyé" };
};

export default register;
