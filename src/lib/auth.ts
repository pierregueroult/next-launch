import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/db";
import { Account, TwoFactorConfirmation, User, UserRole } from "@/db/types";
import { loginSchema } from "@/schemas/auth/login";
import { getAccountByUserId } from "@/services/account";
import { deleteTwoFactorConfirmationById, getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import { getUserByEmail, getUserById, verifyUserEmailById } from "@/services/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

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
      const userData: User | null = await getUserById(user.id);
      if (!userData?.emailVerified) return false;

      if (!userData.isTwoFactorEnabled) {
        const twoFactorConfirmation: TwoFactorConfirmation | null = await getTwoFactorConfirmationByUserId(user.id);
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

      const user: User | null = await getUserById(token.sub);
      if (!user) return token;

      const account: Account | null = await getAccountByUserId(user.id);

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
        const user: User | null = await getUserByEmail(email);
        if (!user) return null;

        const passwordMatch: boolean = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
});
