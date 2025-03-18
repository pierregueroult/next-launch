import React, { type ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to next-launch",
  description: "Generated with `npx create-next-launch`",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
