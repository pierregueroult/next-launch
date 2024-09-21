import "server-only";

import { Account } from "@/db/types";
import prisma from "@/db";

/* eslint-disable import/prefer-default-export */
export const getAccountByUserId = async (userId: string): Promise<Account | null> =>
  prisma.account.findFirst({
    where: { userId },
  });
