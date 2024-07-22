/* eslint-disable import/prefer-default-export */

import prisma from "@/db";
import { Account } from "@/db/types";

export const getAccountByUserId = async (userId: string): Promise<Account | null> =>
  prisma.account.findFirst({
    where: { userId },
  });
