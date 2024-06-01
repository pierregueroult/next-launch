import React, { ReactNode } from "react";
import "@/styles/globals.css";

function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body>{children}</body>
    </html>
  );
}

export default Layout;
