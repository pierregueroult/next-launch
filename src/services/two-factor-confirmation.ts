import "server-only";

import { TwoFactorConfirmation } from "@/db/types";
import prisma from "@/db";

export const getTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> =>
  prisma.twoFactorConfirmation.findUnique({
    where: { userId },
  });

export const deleteTwoFactorConfirmationById = async (id: string): Promise<void> => {
  try {
    await prisma.twoFactorConfirmation.delete({
      where: { id },
    });
  } catch {
    /* empty */
  }
};

export const createTwoFactorConfirmation = async (userId: string): Promise<TwoFactorConfirmation> => {
  try {
    await prisma.twoFactorConfirmation.delete({ where: { userId } });
  } catch {
    /* empty */
  }

  return prisma.twoFactorConfirmation.create({
    data: {
      userId,
    },
  });
};
