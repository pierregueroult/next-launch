import prisma from "@/db";
import { User } from "@/db/types";

export const getUserByEmail = async (email: string): Promise<User | null> =>
  prisma.user.findUnique({
    where: { email },
  });

export const getUserById = async (id: string): Promise<User | null> =>
  prisma.user.findUnique({
    where: { id },
  });

export const verifyUserEmailById = async (email: string, id: string): Promise<User | null> =>
  prisma.user.update({
    where: { id },
    data: { emailVerified: new Date() },
  });

export const createUser = async (name: string, email: string, password: string): Promise<User | null> => {
  const user = await getUserByEmail(email);
  if (user) return null;

  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  } catch {
    return null;
  }
};
