import "@testing-library/jest-dom";
import Languages from "@/components/languages/languages";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import locales from "@/lang/locales";
import { render } from "@testing-library/react";

describe("Languages", (): void => {
  jest.mock("next-intl", () => ({
    useLocale: jest.fn(),
  }));

  it("should render the languages list", (): void => {
    const { getByText } = render(
      <NextIntlClientProvider messages={{}} locale="en">
        <Languages />
      </NextIntlClientProvider>,
    );
    locales.forEach((locale: string): void => {
      expect(getByText(locale)).toBeInTheDocument();
    });
  });

  it("should should underline the current locale", (): void => {
    const { getByText } = render(
      <NextIntlClientProvider messages={{}} locale="en">
        <Languages />
      </NextIntlClientProvider>,
    );
    expect(getByText("en").classList.contains("underline")).toBeTruthy();
  });
});
