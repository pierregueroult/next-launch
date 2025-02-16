/** @type {import('prettier').Config} */
const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: [
    "server-only",
    "react",
    "next",
    "next/(.*)$",
    "^@/components/(.*)$",
    "^@/(.*)$",
    "^[./]",
    "<THIRD_PARTY_MODULES>",
  ],
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  bracketSpacing: true,
  semi: true,
  singleQuote: false,
};

export default config;
