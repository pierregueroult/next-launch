import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserByEmail, getUserById, verifyUserEmailById } from "@/services/user";
import Credentials from "next-auth/providers/credentials";
import { getAccountByUserId } from "@/services/account";
import { deleteTwoFactorConfirmationById, getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import bcrypt from "bcryptjs";
import { UserRole } from "@/db/types";
import prisma from "@/db";
import { loginSchema } from "@/schemas/auth/login";

export const { handlers, signIn, signOut, auth } = NextAuth({
  events: {
    async linkAccount({ user }) {
      const { id, email } = user;
      if (!id || !email) return;
      await verifyUserEmailById(email, id);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const userData = await getUserById(user.id);
      if (!userData?.emailVerified) return false;

      if (!userData.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id);
        if (!twoFactorConfirmation) return false;
        await deleteTwoFactorConfirmationById(twoFactorConfirmation.id);
      }
      return true;
    },
    async session({ session, token }) {
      const newSession = { ...session, user: { ...session.user } };

      if (token.sub && newSession.user) {
        newSession.user.id = token.sub;
      }

      if (token.role && newSession.user) {
        newSession.user.role = token.role as UserRole;
      }

      if (newSession.user) {
        newSession.user.name = token.name;
        newSession.user.email = token.email as string;
        newSession.user.isOAuth = token.isOAuth as boolean;
      }

      return newSession;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      const account = await getAccountByUserId(user.id);

      return {
        ...token,
        isOAuth: !!account,
        name: user.name,
        email: user.email,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const fields = loginSchema.safeParse(credentials);
        if (!fields.success) return null;

        const { email, password } = fields.data;
        const user = await getUserByEmail(email);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
});
