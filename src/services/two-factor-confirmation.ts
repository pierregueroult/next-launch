import "server-only";
import { cache } from "react";
import prisma from "@/db";
import { TwoFactorConfirmation } from "@/db/types";

async function getTwoFactorConfirmationByUserId(userId: string): Promise<TwoFactorConfirmation | null> {
  return prisma.twoFactorConfirmation.findUnique({
    where: { userId },
  });
}

async function deleteTwoFactorConfirmationById(id: string): Promise<void> {
  try {
    await prisma.twoFactorConfirmation.delete({
      where: { id },
    });
  } catch {
    /* empty */
  }
}

async function createTwoFactorConfirmation(userId: string): Promise<TwoFactorConfirmation> {
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
}

const cachedGetTwoFactorConfirmationByUserId = cache(getTwoFactorConfirmationByUserId);

export {
  getTwoFactorConfirmationByUserId,
  deleteTwoFactorConfirmationById,
  createTwoFactorConfirmation,
  cachedGetTwoFactorConfirmationByUserId,
};
