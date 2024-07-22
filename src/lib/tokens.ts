import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEmail,
} from "@/services/verification-token";
import { createTwoFactorToken, deleteTwoFactorTokenById, getTwoFactorTokenByEmail } from "@/services/two-factor-token";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) await deleteVerificationTokenById(existingToken.id);

  return createVerificationToken(email, token, expires);
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) await deleteTwoFactorTokenById(existingToken.id);

  return createTwoFactorToken(email, token, expires);
};
