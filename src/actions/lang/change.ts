"use server";

import { cookies } from "next/headers";
import localeSchema from "@/schemas/lang/locale";
import { Locale } from "@/types/lang";

async function changeLang(lang: Locale): Promise<void> {
  const locale = localeSchema.safeParse(lang);
  if (!locale.success) return;
  (await cookies()).set({ name: "locale", value: locale.data, secure: true });
}

export default changeLang;
