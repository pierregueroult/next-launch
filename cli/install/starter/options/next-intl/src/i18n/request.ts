import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/i18n/locales";
import type { Locale } from "@/types/locale";

export default getRequestConfig(async () => {
  let locale: string | undefined = cookies().get("locale")?.value;

  if (locale === undefined || !locales.includes(locale as Locale)) locale = defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
