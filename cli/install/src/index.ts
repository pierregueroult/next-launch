#!/usr/bin/env node
import { CLI_DESCRIPTION, CLI_NAME } from "./constants.js";
import { getCliVersion } from "./lib/version.js";
import { type Options } from "./schemas/options.js";
import parseOptions from "./utils/parse-options.js";
import printMotd from "./utils/print-motd.js";
import { booleanPrompt, selectPrompt } from "./utils/prompts.js";
import { program } from "commander";

program.name(CLI_NAME).description(CLI_DESCRIPTION).version(getCliVersion());

program
  .command("init", { isDefault: true })
  .option("--verbose", "Print additional information during the project creation process")
  .option("--tailwind", "Add tailwindcss and related utilities to the boilerplate")
  .option("--git", "Initialize a git repository")
  .option("--install", "Install dependencies after the project is created")
  .option("--package-manager <package-manager>", "The package manager to use")
  .description(CLI_DESCRIPTION)
  .action(async (flags): Promise<void> => {
    // * Initialize options
    globalThis.isVerbose = flags && "verbose" in flags && flags.verbose === true;
    const options: Options = parseOptions(flags);
    await printMotd();

    // * Prompt for options if not provided
    if (!options.tailwind) {
      options.tailwind = await booleanPrompt("Would you like to add tailwindcss to the project?", true);
    }
    if (!options.git) {
      options.git = await booleanPrompt("Would you like to initialize a git repository?", true);
    }
    if (!options.install) {
      options.install = await booleanPrompt("Would you like to install dependencies ?", true);
    }
    if (!options["package-manager"]) {
      options["package-manager"] = await selectPrompt(
        "Which package manager would you like to use?",
        [
          { label: "pnpm (recommended)", value: "pnpm" },
          { label: "npm", value: "npm" },
          { label: "yarn", value: "yarn" },
        ],
        "pnpm",
      );
    }

    // * Setup the project
  });

program.parse(process.argv);
