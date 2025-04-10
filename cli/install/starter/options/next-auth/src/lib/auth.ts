import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // There goes the logic to validate the received credentials

        // There goes the logic to check if the user is valid
        if (credentials?.email === "admin" && credentials?.password === "admin") {
          return {
            email: "admin",
            name: "Admin",
          };
        }
        return null;
      },
    }),
  ],
});
