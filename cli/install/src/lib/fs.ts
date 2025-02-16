import * as fs from "node:fs";
import * as path from "node:path";

export async function createDirectory(dir: string, mustNotExist: boolean = false): Promise<void> {
  try {
    if (mustNotExist) {
      const exists = await directoryExists(dir);
      if (exists) {
        console.log("TODO: Directory exists");
        process.exit(1);
      }
    }

    await fs.promises.mkdir(dir, { recursive: true });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error) {
      if (error.code === "EEXIST") {
        console.log("TODO: Directory exists");
      } else {
        console.log("TODO: Error creating directory");
        if (globalThis.isVerbose) console.error(error);
      }
    }
    process.exit(1);
  }
}

const specialBehaviorFiles = new Set(["dependencies.yaml", "commands.yaml", "ignores.yaml"]);

export async function copyDirectory(source: string, destination: string): Promise<void> {
  const entries = await fs.promises.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath: string = path.join(source, entry.name);
    const destinationPath: string = path.join(destination, entry.name);

    if (specialBehaviorFiles.has(entry.name)) continue;

    if (entry.isDirectory()) {
      await createDirectory(destinationPath, false);
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

export async function copyFile(source: string, destination: string): Promise<void> {
  try {
    try {
      await fs.promises.access(destination);
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error) {
        if (error.code === "ENOENT") {
          await fs.promises.copyFile(source, destination);
        } else {
          throw error;
        }
      } else {
        throw new Error("Unknown error");
      }
    }
  } catch (error: unknown) {
    console.log("TODO: Error copying file");
    if (globalThis.isVerbose) console.error(error);
    process.exit(1);
  }
}

export async function directoryExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path, fs.promises.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function directoryExistsSync(path: string): boolean {
  try {
    fs.accessSync(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
