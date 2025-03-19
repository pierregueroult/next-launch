#!/usr/bin/env node
import { CLI_DESCRIPTION, CLI_NAME } from "./constants.js";
import { getAllOptions } from "./lib/options.js";
import { setupProject } from "./lib/project.js";
import { getCliVersion } from "./lib/version.js";
import type { Options } from "./schemas/options.js";
import { parseOptions } from "./utils/parse-options.js";
import { startMotd, endMotd } from "./utils/print-motd.js";
import { booleanPrompt, selectPrompt, projectNamePrompt, projectOptionsPrompt } from "./utils/prompts.js";
import { Command } from "commander";

const program = new Command();

program.name(CLI_NAME).description(CLI_DESCRIPTION).version(getCliVersion());

const initCommand = new Command("init")
  .argument("[name]", "The name of the project")
  .option("--git", "Initialize a git repository")
  .option("--install", "Install dependencies after the project is created")
  .option("--package-manager <package-manager>", "The package manager to use")
  .option("--verbose", "Print additional information during the project creation process")
  .action(async (name, flags): Promise<void> => {
    globalThis.isVerbose = flags && "verbose" in flags && flags.verbose === true;
    let options: Options = parseOptions(name ? { name, ...flags } : flags);

    await startMotd();

    if (!options.name) {
      options.name = await projectNamePrompt("What is the name of the project ?", "");
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

    const optionsList = getAllOptions();

    const selectedOptions = await projectOptionsPrompt(
      "Select the options you would like to include in your project",
      optionsList,
      optionsList.map((option) => (options[option.name] ? option.name : false)).filter(Boolean) as string[],
    );

    options = {
      ...options,
      ...(selectedOptions.reduce((acc, option) => {
        acc[option] = true;
        return acc;
      }, {}) as Options),
    };

    await setupProject(options);

    endMotd(options.name, options["package-manager"]);
  });

const options = getAllOptions();

options.forEach((option) => {
  initCommand.option(`--${option.name}`, `Include the "${option.message}" option`);
});

program.addCommand(initCommand, { isDefault: true });

program.parse(process.argv);
