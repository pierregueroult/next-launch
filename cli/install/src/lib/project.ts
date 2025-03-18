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

  await createDirectory(projectDir, true);
  await copyDirectory(baseTemplateDir, projectDir);

  let dependencies: Dependencies = await addDependencies({ dependencies: {}, devDependencies: {} }, baseTemplateDir);
  let commands: Commands = await addCommands({ commands: {} }, baseTemplateDir);
  let ignores: Ignores = await addIgnores({ git: "" }, baseTemplateDir);

  const templateOptions: { [key: string]: boolean } = {
    ...Object.entries(options)
      .filter(([, value]) => typeof value === "boolean")
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}),
  };

  const theyAreNotTemplates = ["git", "install"];

  for (const [key, value] of Object.entries(templateOptions)) {
    if (theyAreNotTemplates.includes(key)) continue;
    if (value) {
      const templateDir: string = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        `../../starter/options/${key}`,
      );
      dependencies = await addDependencies(dependencies, templateDir);
      commands = await addCommands(commands, templateDir);
      ignores = await addIgnores(ignores, templateDir);

      await copyDirectory(templateDir, projectDir);
    }
  }

  await generatePackageJson(dependencies, commands, projectDir, options.name);
  await generateGitIgnore(ignores, projectDir);
}
