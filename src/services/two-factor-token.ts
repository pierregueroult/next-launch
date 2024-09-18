import "server-only";

import prisma from "@/db";
import { TwoFactorToken } from "@/db/types";

export const getTwoFactorTokenByToken = async (token: string): Promise<TwoFactorToken | null> =>
  prisma.twoFactorToken.findUnique({
    where: { token },
  });

export const getTwoFactorTokenByEmail = async (email: string): Promise<TwoFactorToken | null> =>
  prisma.twoFactorToken.findFirst({
    where: { email },
  });

export const deleteTwoFactorTokenById = async (id: string): Promise<void> => {
  try {
    await prisma.twoFactorToken.delete({
      where: { id },
    });
  } catch {
    /* empty */
  }
};

export const createTwoFactorToken = async (email: string, token: string, expires: Date): Promise<TwoFactorToken> =>
  prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
