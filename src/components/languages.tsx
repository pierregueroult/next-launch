"use client";

import React, { FormEvent } from "react";
import { Locale } from "@/types/lang";
import changeLang from "@/actions/lang/change";
import locales from "@/lang/locales";
import { useLocale } from "next-intl";

export default function Languages() {
  const currentLocale = useLocale();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lang: string = ((e.target as HTMLFormElement).elements.namedItem("locale") as HTMLInputElement).value;
    if (locales.includes(lang as Locale)) await changeLang(lang as Locale);
  };

  return (
    <ul className="mb-32 mt-4 flex flex-row items-center justify-center gap-4">
      {locales.map((locale) => (
        <li key={locale}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <button
              className={`uppercase ${currentLocale === locale ? "text-black underline" : "text-gray-500"}`}
              type="submit"
              name="locale"
              value={locale}
            >
              {locale}
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
