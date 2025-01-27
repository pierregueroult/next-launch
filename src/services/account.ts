import prisma from "@/db";
import { Account } from "@/db/types";
import "server-only";

/* eslint-disable import/prefer-default-export */
export const getAccountByUserId = async (userId: string): Promise<Account | null> =>
  prisma.account.findFirst({
    where: { userId },
  });
