import "server-only";

import { VerificationToken } from "@/db/types";
import prisma from "@/db";

export const getVerificationTokenByToken = async (token: string): Promise<VerificationToken | null> => {
  try {
    return await prisma.verificationToken.findUnique({
      where: { token },
    });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string): Promise<VerificationToken | null> => {
  try {
    return await prisma.verificationToken.findFirst({
      where: { email },
    });
  } catch {
    return null;
  }
};

export const deleteVerificationTokenById = async (id: string): Promise<void> => {
  try {
    await prisma.verificationToken.delete({
      where: { id },
    });
  } catch {
    /* empty */
  }
};

export const createVerificationToken = async (
  email: string,
  token: string,
  expires: Date,
): Promise<VerificationToken> =>
  prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
