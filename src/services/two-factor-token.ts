import prisma from "@/db";
import { TwoFactorToken } from "@/db/types";

export const getTwoFactorTokenByToken = async (token: string): Promise<TwoFactorToken | null> => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: {
        token,
      },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string): Promise<TwoFactorToken | null> => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const deleteTwoFactorTokenById = async (id: string): Promise<void> => {
  try {
    await prisma.twoFactorToken.delete({
      where: {
        id,
      },
    });
  } catch {
    // TODO: refactor this
  }
};

export const createTwoFactorToken = async (email: string, token: string, expires: Date): Promise<TwoFactorToken> => {
  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};
