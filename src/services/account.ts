import "server-only";
import { cache } from "react";
import prisma from "@/db";
import { Account } from "@/db/types";

async function getAccountByUserId(userId: string): Promise<Account | null> {
  return prisma.account.findFirst({
    where: { userId },
  });
}

const cachedGetAccountByUserId = cache(getAccountByUserId);

export { getAccountByUserId, cachedGetAccountByUserId };
