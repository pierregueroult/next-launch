import { copyDirectory, createDirectory } from "./fs.js";
import { addDependencies, generatePackageJson, addCommands, addIgnores, generateGitIgnore } from "./package.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { RequiredOptions } from "src/schemas/options.js";
import { Dependencies, Commands, Ignores } from "src/types/packages.js";

export async function setupProject(options: RequiredOptions): Promise<void> {
  // Setting up the directory structure
  const projectDir: string = path.resolve(process.cwd(), options.name);
  const baseTemplateDir: string = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../starter/base");

  // Copying the base template to the project directory
  await createDirectory(projectDir, true);
  await copyDirectory(baseTemplateDir, projectDir);

  // Handle templates options (including there dependencies and commands)
  let dependencies: Dependencies = await addDependencies({ dependencies: {}, devDependencies: {} }, baseTemplateDir);
  let commands: Commands = await addCommands({ commands: {} }, baseTemplateDir);
  let ignores: Ignores = await addIgnores({ git: "" }, baseTemplateDir);

  if (options.tailwind) {
    const tailwindTemplateDir: string = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../starter/options/tailwind",
    );

    await copyDirectory(tailwindTemplateDir, projectDir);

    dependencies = await addDependencies(dependencies, tailwindTemplateDir);
    commands = await addCommands(commands, tailwindTemplateDir);
    ignores = await addIgnores(ignores, tailwindTemplateDir);
  }

  if (options.emails) {
    const emailsTemplateDir: string = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../starter/options/emails",
    );

    await copyDirectory(emailsTemplateDir, projectDir);

    dependencies = await addDependencies(dependencies, emailsTemplateDir);
    commands = await addCommands(commands, emailsTemplateDir);
    ignores = await addIgnores(ignores, emailsTemplateDir);
  }

  // Generate the package.json file
  await generatePackageJson(dependencies, commands, projectDir, options.name);
  await generateGitIgnore(ignores, projectDir);

  // Handle the optional commands
  // there will go git and install commands
}
