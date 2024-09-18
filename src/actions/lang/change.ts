"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import locales from "@/lang/locales";
import { Locale } from "@/types/lang";

const localeSchema = z.enum(locales);

async function changeLang(lang: Locale): Promise<void> {
  const locale = localeSchema.safeParse(lang);
  if (!locale.success) return;
  cookies().set({ name: "locale", value: locale.data, secure: true });
}

export default changeLang;
