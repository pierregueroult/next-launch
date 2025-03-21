import { Locale } from "@/types/locale";

export const locales = ["en", "fr"] as const;

export const completeLocale: {
  lang: Locale;
  name: string;
}[] = [
  {
    lang: "fr",
    name: "Français",
  },
  {
    lang: "en",
    name: "English",
  },
];

export const defaultLocale: "en" = locales[0];
