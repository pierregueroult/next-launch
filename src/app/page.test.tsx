import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
import Page from "@/app/page";
import React from "react";
import messages from "@/lang/messages/en.json";
import pick from "@/lib/pick";
import { render } from "@testing-library/react";

describe("Page", (): void => {
  jest.mock("next-intl", () => ({
    useTranslations: jest.fn(),
  }));

  it("should render the page", (): void => {
    const { getByText } = render(
      <NextIntlClientProvider messages={pick(messages, ["Welcome"])} locale="en">
        <Page />
      </NextIntlClientProvider>,
    );
    expect(getByText("Welcome to Next Launch 🚀!")).toBeInTheDocument();
  });
});
