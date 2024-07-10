import prisma from "@/db";
import { Account } from "@/db/types";

export const getAccountByUserId = async (userId: string): Promise<Account | null> => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
      },
    });
    return account;
  } catch {
    return null;
  }
};

export const getAccountsByProvider = async (provider: string): Promise<Account[] | null> => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        provider,
      },
    });
    return accounts;
  } catch {
    return null;
  }
};
