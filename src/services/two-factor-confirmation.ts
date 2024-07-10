import prisma from "@/db";
import { TwoFactorConfirmation } from "@/db/types";

export const getTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });
    return twoFactorConfirmation;
  } catch {
    return null;
  }
};

export const deleteTwoFactorConfirmation = async (
  twoFactorConfirmationId: string,
): Promise<TwoFactorConfirmation | null> => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.delete({
      where: {
        id: twoFactorConfirmationId,
      },
    });
    return twoFactorConfirmation;
  } catch {
    return null;
  }
};

export const deleteTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> => {
  try {
    await prisma.twoFactorConfirmation.delete({
      where: {
        userId,
      },
    });
  } catch {
    // TODO: refactor this
  }
  return null;
};

export const createTwoFactorConfirmation = async (userId: string): Promise<TwoFactorConfirmation> => {
  try {
    await deleteTwoFactorConfirmationByUserId(userId);
  } catch {
    // TODO: refactor this
  }
  const twoFactorConfirmation = await prisma.twoFactorConfirmation.create({
    data: {
      userId,
    },
  });
  return twoFactorConfirmation;
};
