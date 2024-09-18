import React, { ReactNode } from "react";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Languages from "@/components/languages";

export const metadata: Metadata = {
  title: "Welcome to Next Launch ",
  description:
    "A free and open source web app boilerplate based on Next.js, offering you an easy way to get started with your next project.",
};

function Page(): ReactNode {
  const t = useTranslations("Welcome");

  return (
    <main>
      <section className="flex h-screen flex-col items-center justify-center">
        <h1 className="mt-8 text-center text-3xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-center text-lg">{t("description")}</p>
        <p className="mt-4 text-center text-sm text-gray-500">{t("headless")}</p>
        <small className="mt-4 block w-full text-center text-sm text-gray-500">
          {t("contribute.made")}{" "}
          <a href="https://twitter.com/pierregueroult1" className="underline" target="_blank" rel="noreferrer">
            {t("contribute.by")}
          </a>
          {t("contribute.on")}{" "}
          <a
            href="https://github.com/pierregueroult/next-launch"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            {t("contribute.github")}
          </a>
          .
        </small>
        <Languages />
      </section>
      <section className="mt-16 flex h-screen w-full flex-col items-center justify-center">
        <div>
          <h2 className="text-xl font-bold">✨Features</h2>
          <ul className="list-inside list-disc">
            <li>
              Authentication with{" "}
              <a href="https://authjs.dev/" className="underline" target="_blank" rel="noreferrer">
                AuthJS
              </a>
            </li>
            <li>
              Emails with{" "}
              <a href="https://react.email/" className="underline" target="_blank" rel="noreferrer">
                React Email
              </a>
              {" and "}
              <a href="https://nodemailer.com/" className="underline" target="_blank" rel="noreferrer">
                Nodemailer
              </a>
            </li>
            <li>
              Database with{" "}
              <a href="https://www.prisma.io/" className="underline" target="_blank" rel="noreferrer">
                Prisma
              </a>
              {", "}
              <a href="https://www.docker.com/" className="underline" target="_blank" rel="noreferrer">
                Docker Compose
              </a>
              {" and "}
              <a href="https://www.postgresql.org/" className="underline" target="_blank" rel="noreferrer">
                PostgreSQL
              </a>
            </li>
            <li>
              Styling with{" "}
              <a href="https://tailwindcss.com/" className="underline" target="_blank" rel="noreferrer">
                Tailwind CSS
              </a>
            </li>
          </ul>
          {process.env.IS_DEMO === "false" && (
            <>
              <h2 className="mt-4 text-xl font-bold">🚀 Try the features :</h2>
              <small>Make sure you have a database setup and the email script running.</small>
              <ul className="mt-4 list-inside list-disc">
                <li>
                  <a href="http://localhost:3000/login" className="underline">
                    Login
                  </a>{" "}
                  /{" "}
                  <a href="http://localhost:3000/auth/register" className="underline">
                    Register
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Page;
