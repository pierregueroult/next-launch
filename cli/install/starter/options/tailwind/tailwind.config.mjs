import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {},
  plugins: [animatePlugin],
};

export default config;
