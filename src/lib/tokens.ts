import { TwoFactorToken, VerificationToken } from "@/db/types";
import { createTwoFactorToken, deleteTwoFactorTokenById, getTwoFactorTokenByEmail } from "@/services/two-factor-token";
import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEmail,
} from "@/services/verification-token";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

export const generateVerificationToken = async (email: string): Promise<VerificationToken> => {
  const token: string = uuid();
  const expires: Date = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) await deleteVerificationTokenById(existingToken.id);

  return createVerificationToken(email, token, expires);
};

export const generateTwoFactorToken = async (email: string): Promise<TwoFactorToken> => {
  const token: string = crypto.randomInt(100000, 999999).toString();
  const expires: Date = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken: TwoFactorToken | null = await getTwoFactorTokenByEmail(email);
  if (existingToken) await deleteTwoFactorTokenById(existingToken.id);

  return createTwoFactorToken(email, token, expires);
};
