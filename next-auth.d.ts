import { type DefaultSession } from "next-auth";
import { UserRole } from "@/db/types";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: ExtendedUser;
  }
}
