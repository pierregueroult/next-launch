import { Command } from "commander";

const program = new Command();

program
  .command("init")
  .description("init project")
  .action(() => {
    console.log("init project");
  });

program.parse(process.argv);
