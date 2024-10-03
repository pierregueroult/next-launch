import "@/styles/globals.css";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import React, { ReactNode } from "react";
import { getLocale, getMessages } from "next-intl/server";
import { getLangDir } from "rtl-detect";

async function Layout({ children }: { children: ReactNode }): Promise<ReactNode> {
  const locale: string = await getLocale();
  const direction: "ltr" | "rtl" = getLangDir(locale);
  const messages: AbstractIntlMessages = await getMessages();

  return (
    <html lang={locale} dir={direction}>
      <head />
      <body>
        {/* Feel free to move this provider wherever you need messages on the client, using the pick function to only select what you need */}
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

export default Layout;
