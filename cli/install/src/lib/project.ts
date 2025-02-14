import { RequiredOptions } from "src/schemas/options.js";

export async function setupProject(options: RequiredOptions): Promise<void> {
  // * Step 1: Create the project directory

  // * Step 2: Copy the base template files

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
