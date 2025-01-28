import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

const config: UserConfig = {
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
      ],
    ],
    "type-case": [RuleConfigSeverity.Disabled, "always", "lower-case"],
    "subject-case": [RuleConfigSeverity.Error, "always", "lower-case"],
  },
};

export default config;
