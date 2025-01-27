import "server-only";
import { cache } from "react";
import prisma from "@/db";
import { VerificationToken } from "@/db/types";

async function getVerificationTokenByToken(token: string): Promise<VerificationToken | null> {
  try {
    return await prisma.verificationToken.findUnique({
      where: { token },
    });
  } catch {
    return null;
  }
}

async function getVerificationTokenByEmail(email: string): Promise<VerificationToken | null> {
  try {
    return await prisma.verificationToken.findFirst({
      where: { email },
    });
  } catch {
    return null;
  }
}

async function deleteVerificationTokenById(id: string): Promise<void> {
  try {
    await prisma.verificationToken.delete({
      where: { id },
    });
  } catch {
    /* empty */
  }
}

async function createVerificationToken(email: string, token: string, expires: Date): Promise<VerificationToken> {
  return prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}

const cachedGetVerificationTokenByToken = cache(getVerificationTokenByToken);
const cachedGetVerificationTokenByEmail = cache(getVerificationTokenByEmail);

export {
  getVerificationTokenByToken,
  getVerificationTokenByEmail,
  deleteVerificationTokenById,
  createVerificationToken,
  cachedGetVerificationTokenByToken,
  cachedGetVerificationTokenByEmail,
};
