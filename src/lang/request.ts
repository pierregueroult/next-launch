import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import locales from "./locales";

export default getRequestConfig(async () => {
  let locale: string | undefined = cookies().get("locale")?.value;

  if (locale === undefined || !locales.includes(locale as any)) locale = "en";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
