import "@/styles/globals.css";
import React, { ReactNode } from "react";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getLangDir } from "rtl-detect";

async function Layout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const direction = getLangDir(locale);

  const messages = await getMessages();
  return (
    <html lang={locale} dir={direction}>
      <head />
      <body>
        {/* Feel free tomove this provider wherever you need messages (optimisation hehe) */}
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

export default Layout;
