import { getRequestConfig } from "next-intl/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import locales from "./locales";

export default getRequestConfig(async () => {
  const store: ReadonlyRequestCookies = await cookies();
  let locale: string | undefined = store.get("locale")?.value;

  if (locale === undefined || !locales.includes(locale as any)) locale = "en";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
