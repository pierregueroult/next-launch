import { addCommands } from "./commands.js";
import { addDependencies } from "./deps.js";
import { copyDirectory, createDirectory } from "./fs.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { RequiredOptions } from "src/schemas/options.js";
import { Commands } from "src/types/commands.js";
import { Dependencies } from "src/types/dependencies.js";

export async function setupProject(options: RequiredOptions): Promise<void> {
  const projectDir: string = path.resolve(process.cwd(), options.name);
  const baseTemplateDir: string = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../starter/base");

  await createDirectory(projectDir, true);

  await copyDirectory(baseTemplateDir, projectDir);

  let dependencies: Dependencies = await addDependencies({ dependencies: {}, devDependencies: {} }, baseTemplateDir);
  let commands: Commands = await addCommands({ commands: {} }, baseTemplateDir);

  if (options.tailwind) {
    const tailwindTemplateDir: string = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../starter/options/tailwind",
    );

    await copyDirectory(tailwindTemplateDir, projectDir);

    dependencies = await addDependencies(dependencies, tailwindTemplateDir);
    commands = await addCommands(commands, tailwindTemplateDir);
  }

  console.log(dependencies);
  console.log(commands);
}
