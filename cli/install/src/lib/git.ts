import { exec } from "node:child_process";
import { promisify } from "node:util";
import ora from "ora";

const execPromise = promisify(exec);

export async function initGitRepository(projectDir: string, isFirst: boolean = false): Promise<void> {
  console.log("\x1b[90m│");
  if (!isFirst) console.log("\x1b[90m│");
  const spinner = ora("Initializing git repository").start();

  try {
    await execPromise("git init", { cwd: projectDir });
    spinner.succeed("Git repository initialized successfully");
  } catch (error: unknown) {
    spinner.fail("Error initializing git repository");
    if (globalThis.isVerbose) console.error(error);
  }
}
