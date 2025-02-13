import { CLI_DESCRIPTION, CLI_NAME } from "./constants.js";
import { getCliVersion } from "./lib/version.js";
import { program } from "commander";

program
  .name(CLI_NAME)
  .description(CLI_DESCRIPTION)
  .version(getCliVersion())
  .option("-h, --help", "display help for command");

program
  .command("init", { isDefault: true })
  .description(CLI_DESCRIPTION)
  .action(async (options): Promise<void> => {
    console.log("init command", options);
  });

program.parse(process.argv);
