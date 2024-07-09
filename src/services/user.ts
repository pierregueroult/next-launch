import { User } from "@/db/types";
import prisma from "@/db";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const verifyUserById = async (email: string, id: string): Promise<User | null> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        emailVerified: new Date(),
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const createUser = async (email: string, password: string, name: string): Promise<User | null> => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const updateLastLoginUser = async (id: string): Promise<User | null> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        lastLogin: new Date(),
      },
    });
    return user;
  } catch {
    return null;
  }
};
