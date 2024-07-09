import prisma from "@/db";
import { VerificationToken } from "@/db/types";

export const getVerificationToken = async (token: string): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const deleteVerificationTokenById = async (id: string): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.delete({
      where: {
        id,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const createVerificationToken = async (
  token: string,
  email: string,
  expires: Date,
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        token,
        email,
        expires,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
