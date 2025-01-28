import { Session } from "next-auth";
import { User } from "@/db/types";
import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/services/user";

const isAdmin = async (): Promise<boolean> => {
  const session: Session | null = await auth();
  if (!session || !session.user || !session.user.email) return false;
  const user: User | null = await getUserByEmail(session.user.email);
  return !(!user || (user.role !== "ADMIN" && user.role !== "DEV"));
};

const isDisconnected = async (): Promise<boolean> => {
  const session: Session | null = await auth();
  return !session;
};

const isConnected = async (): Promise<boolean> => {
  const session: Session | null = await auth();
  return !!session;
};

const getCurrentUser = async () => {
  const session: Session | null = await auth();
  return session?.user;
};

export { isAdmin, isDisconnected, isConnected, getCurrentUser };
