import { cache } from "react";
import prisma from "@/db";
import { TwoFactorToken } from "@/db/types";
import "server-only";

async function getTwoFactorTokenByToken(token: string): Promise<TwoFactorToken | null> {
  return prisma.twoFactorToken.findUnique({
    where: { token },
  });
}

async function getTwoFactorTokenByEmail(email: string): Promise<TwoFactorToken | null> {
  return prisma.twoFactorToken.findFirst({
    where: { email },
  });
}

async function deleteTwoFactorTokenById(id: string): Promise<void> {
  try {
    await prisma.twoFactorToken.delete({
      where: { id },
    });
  } catch {
    /* empty */
  }
}

async function createTwoFactorToken(email: string, token: string, expires: Date): Promise<TwoFactorToken> {
  return prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}

const cachedGetTwoFactorTokenByToken = cache(getTwoFactorTokenByToken);
const cachedGetTwoFactorTokenByEmail = cache(getTwoFactorTokenByEmail);

export {
  getTwoFactorTokenByToken,
  getTwoFactorTokenByEmail,
  deleteTwoFactorTokenById,
  createTwoFactorToken,
  cachedGetTwoFactorTokenByToken,
  cachedGetTwoFactorTokenByEmail,
};
