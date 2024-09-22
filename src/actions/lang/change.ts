"use server";

import { Locale } from "@/types/lang";
import { cookies } from "next/headers";
import localeSchema from "@/schemas/lang/locale";

async function changeLang(lang: Locale): Promise<void> {
  const locale = localeSchema.safeParse(lang);
  if (!locale.success) return;
  cookies().set({ name: "locale", value: locale.data, secure: true });
}

export default changeLang;
