import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import jest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirName = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: filename,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  ...compat.extends("next/core-web-vitals", "airbnb", "airbnb-typescript", "prettier"),
  {
    plugins: {
      prettier,
      jest,
    },
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: dirName,
      },
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".tsx"],
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.test.js",
            "**/*.test.jsx",
            "**/*.spec.ts",
            "**/*.spec.tsx",
            "**/*.spec.js",
            "**/*.spec.jsx",
            "commitlint.config.ts",
            "eslint.config.mjs",
          ],
        },
      ],
    },
  },
];

export default config;
