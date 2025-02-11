import { Command } from "commander";

const program = new Command()
  .name("create-next-launch")
  .description("Create a new Next.js project with Launch Design System")
  .action(() => {
    console.log("Hello from create-next-launch");
  });

program.parse(process.argv);
