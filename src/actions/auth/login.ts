"use server";

import { AuthError } from "next-auth";
import send from "@/emails/send";
import { twoFactorEmail } from "@/emails/templates/two-factor-email";
import { verificationEmail } from "@/emails/templates/verification-email";
import { signIn } from "@/lib/auth";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { LoginSchema, loginSchema } from "@/schemas/auth/login";
import { createTwoFactorConfirmation } from "@/services/two-factor-confirmation";
import { deleteTwoFactorTokenById, getTwoFactorTokenByEmail } from "@/services/two-factor-token";
import { getUserByEmail } from "@/services/user";
import bcrypt from "bcryptjs";

const login = async (values: LoginSchema, callbackUrl?: string) => {
  const fields = loginSchema.safeParse(values);
  if (!fields.success) return { error: fields.error.message };

  const { email, password, code } = values;
  const user = await getUserByEmail(email);

  if (!user) return { error: "Les entrées sont invalides" };

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await send({
      to: email,
      subject: "Verify your email",
      template: verificationEmail({ email: verificationToken.email, token: verificationToken.token }),
    });
    return { success: "Un email de vérification vous a été envoyé" };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return { error: "Les entrées sont invalides" };

  if (user.isTwoFactorEnabled && user.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(email);
      if (!twoFactorToken) return { error: "Le code de vérification est invalide" };
      if (twoFactorToken.token !== code) return { error: "Le code de vérification est invalide" };

      const hasExpired: boolean = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Le code de vérification a expiré" };

      await deleteTwoFactorTokenById(twoFactorToken.id);
      const existingConfirmation = await getTwoFactorTokenByEmail(email);
      if (existingConfirmation) await deleteTwoFactorTokenById(existingConfirmation.id);

      await createTwoFactorConfirmation(user.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(user.email);

      await send({
        to: email,
        subject: "Two-factor authentication",
        template: twoFactorEmail({
          email: twoFactorToken.email,
          token: twoFactorToken.token,
          expires: twoFactorToken.expires,
        }),
      });
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? "/",
    });

    return { success: "Connexion réussie" };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Les entrées sont invalides" };
      }
      return { error: "Une erreur est survenue lors de la connexion" };
    }
    throw error;
  }
};

export default login;
