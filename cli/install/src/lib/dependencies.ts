import { exec } from "node:child_process";
import { promisify } from "node:util";
import ora from "ora";

const execPromise = promisify(exec);

export async function installDependencies(
  manager: string,
  packageDir: string,
  isFirst: boolean = false,
): Promise<void> {
  console.log("\x1b[90m│");
  if (!isFirst) console.log("\x1b[90m│");

  const installCommand = `${manager} install`;
  const spinner = ora(`Installing dependencies using ${manager}`).start();

  try {
    await execPromise(installCommand, { cwd: packageDir });
    spinner.succeed("Dependencies installed successfully");
  } catch (error: unknown) {
    spinner.fail("Falling back to npm");
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (manager !== "npm") {
      try {
        await execPromise(`npm install`, { cwd: packageDir });
        spinner.succeed("Dependencies installed successfully using npm");
      } catch (npmError: unknown) {
        spinner.fail("Error installing dependencies");
        if (globalThis.isVerbose) console.error(npmError);
        process.exit(1);
      }
    } else {
      throw error;
    }
  }
}
