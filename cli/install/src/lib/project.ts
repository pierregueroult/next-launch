import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { RequiredOptions } from "src/schemas/options.js";

export async function setupProject(options: RequiredOptions): Promise<void> {
  // * Step 1: Create the project directory
  const projectDir: string = path.resolve(process.cwd(), options.name);
  const baseTemplateDir: string = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../starter/base");

  // * Step 2: Copy the base template files
  try {
    await fs.promises.mkdir(projectDir);
  } catch (error) {
    console.error("It is possible that the folder already exists");
    if (globalThis.isVerbose) console.error(error);
    process.exit(1);
  }
  try {
    await fs.promises.cp(baseTemplateDir, projectDir, { recursive: true });
  } catch (error) {
    console.error("Error copying template files");
    if (globalThis.isVerbose) console.error(error);
    process.exit(1);
  }

  // * Step 3: Add the dependencies of the base template to the project (without installing them)

  // * Step 4: Add the other template requested via the options
  if (options.tailwind) {
    // * Add add the tailwind template to the project
    // * Then also add the tailwind dependencies to the project (without installing them)
  }
  if (options.emails) {
    // * Add the email template to the project
    // * Then also add the email dependencies to the project (without installing them)
  }

  // * Run the commands depending on the options
  if (options.git) {
    // * Initialize a git repository
  }

  if (options.install) {
    // * Install the dependencies, depending on the package manager selected
  }
}
