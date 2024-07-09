import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserByEmail, getUserById, verifyUserById } from "@/services/user";
import Credentials from "next-auth/providers/credentials";
import { getAccountByUserId } from "@/services/account";
import { deleteTwoFactorConfirmation, getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import bcrypt from "bcrypt";
import { UserRole } from "@/db/types";
import prisma from "@/db";
import LoginSchema from "@/schemas/auth/login";

export const { handlers, signIn, signOut, auth } = NextAuth({
  events: {
    async linkAccount({ user }) {
      const { id, email } = user;
      if (!id || !email) return;
      await verifyUserById(email, id);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;

      const userData = await getUserById(user.id);

      if (!userData?.emailVerified) return false;
      if (!userData.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(userData.id);
        if (!twoFactorConfirmation) return false;

        await deleteTwoFactorConfirmation(userData.id);
      }
      return true;
    },
    async session({ session, token }) {
      // const updatedSession = session;
      // if (token.sub && session.user) updatedSession.user.id = token.sub;
      // if (token.role && session.user) updatedSession.user.role = token.role as UserRole;
      // if (session.user) {
      //   updatedSession.user.name = token.name;
      //   updatedSession.user.email = token.email as string;
      //   updatedSession.user.isOAuth = token.isOAuth as boolean;
      // }
      // return updatedSession;
      if (session.user) {
        const { sub, role, name, email, isOAuth } = token;
        const result = {
          ...session,
          user: {
            ...session.user,
            ...(sub && { id: sub }),
            name,
            email: email as string,
            isOAuth: isOAuth as boolean,
          },
        };
        if (role) result.user.role = role as UserRole;
        return result;
      }
      return session;
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
        const fields = LoginSchema.safeParse(credentials);
        if (!fields.success) return null;
        const { email, password } = fields.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) return user;
        return null;
      },
    }),
  ],
});
