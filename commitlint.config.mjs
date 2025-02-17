/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "fix",
        "feat",
        "docs",
        "hotfix",
        "refactor",
        "revert",
        "deploy",
        "build",
        "WIP",
        "important",
        "breaking",
        "chore",
        "merge",
        "tools",
      ],
    ],
    "subject-case": [2, "always", "lower-case"],
  },
};

export default config;
