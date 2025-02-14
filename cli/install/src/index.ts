#!/usr/bin/env node
import { CLI_DESCRIPTION, CLI_NAME } from "./constants.js";
import { setupProject } from "./lib/project.js";
import { getCliVersion } from "./lib/version.js";
import { RequiredOptions, type Options } from "./schemas/options.js";
import { parseOptions, parseRequiredOptions } from "./utils/parse-options.js";
import printMotd from "./utils/print-motd.js";
import { booleanPrompt, selectPrompt, textPrompt } from "./utils/prompts.js";
import { program } from "commander";

program.name(CLI_NAME).description(CLI_DESCRIPTION).version(getCliVersion());

program
  .command("init", { isDefault: true })
  .argument("[name]", "The name of the project")
  .option("--verbose", "Print additional information during the project creation process")
  .option("--tailwind", "Add tailwindcss and related utilities to the boilerplate")
  .option("--git", "Initialize a git repository")
  .option("--install", "Install dependencies after the project is created")
  .option("--package-manager <package-manager>", "The package manager to use")
  .description(CLI_DESCRIPTION)
  .action(async (name, flags): Promise<void> => {
    // * Initialize options
    globalThis.isVerbose = flags && "verbose" in flags && flags.verbose === true;
    const options: Options = parseOptions(name ? { name, ...flags } : flags);
    await printMotd();

    // * Prompt for options if not provided
    if (!options.name) {
      options.name = await textPrompt("What is the name of the project ?", "", "my-awesome-next-launch-project");
    }
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
    if (!options.emails) {
      options.emails = await booleanPrompt("Would you like to add email support to the project?", true);
    }

    // * Setup the project
    const completedOptions: RequiredOptions = parseRequiredOptions(options);
    await setupProject(completedOptions);

    // * Print success message
    console.log("Project setup complete!");
  });

program.parse(process.argv);
