import { cache } from "react";
import prisma from "@/db";
import { User } from "@/db/types";
import "server-only";

async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function verifyUserEmailById(email: string, id: string): Promise<User | null> {
  return prisma.user.update({
    where: { id },
    data: { emailVerified: new Date() },
  });
}

async function createUser(name: string, email: string, password: string): Promise<User | null> {
  const user: User | null = await getUserByEmail(email);
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
}

const cachedGetUserByEmail = cache(getUserByEmail);
const cachedGetUserById = cache(getUserById);

export { getUserByEmail, getUserById, verifyUserEmailById, createUser, cachedGetUserByEmail, cachedGetUserById };
