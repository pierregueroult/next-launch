import { PackageJson } from "../types/package-json.js";
import yamlParser from "../utils/yaml-parser.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { Dependencies, YamlDependencies, Commands, Ignores, YamlCommands } from "src/types/packages.js";

export async function addDependencies(dependencies: Dependencies, packageDir: string): Promise<Dependencies> {
  const filePath: string = path.join(packageDir, "dependencies.yaml");

  if (fs.existsSync(filePath)) {
    const newDependencies: YamlDependencies = yamlParser.readYamlSync<YamlDependencies>(filePath);

    return {
      dependencies: {
        ...dependencies.dependencies,
        ...Object.fromEntries(newDependencies.dependencies.map((dep) => [dep.name, dep.version])),
      },
      devDependencies: {
        ...dependencies.devDependencies,
        ...Object.fromEntries(newDependencies.devDependencies.map((dep) => [dep.name, dep.version])),
      },
    };
  } else {
    return dependencies;
  }
}

export async function addCommands(commands: Commands, packageDir: string): Promise<Commands> {
  const filePath: string = path.join(packageDir, "commands.yaml");

  if (fs.existsSync(filePath)) {
    const newCommands: YamlCommands = yamlParser.readYamlSync<YamlCommands>(filePath);

    return {
      commands: {
        ...commands.commands,
        ...newCommands.commands.reduce((acc, command) => {
          const [name, value] = Object.entries(command)[0];
          acc[name] = value;
          return acc;
        }, {}),
      },
    };
  } else {
    return commands;
  }
}

export async function addIgnores(ignore: Ignores, packageDir: string): Promise<Ignores> {
  const filePath: string = path.join(packageDir, "ignores.yaml");

  if (fs.existsSync(filePath)) {
    const newIgnore: Ignores = yamlParser.readYamlSync<Ignores>(filePath);

    return {
      git: `${ignore.git}\n${newIgnore.git}`,
    };
  }
  return ignore;
}

export async function generatePackageJson(
  dependencies: Dependencies,
  commands: Commands,
  projectDir: string,
  projectName: string,
): Promise<void> {
  const packageJsonPath: string = path.join(projectDir, "package.json");

  const packageJson: PackageJson = {
    name: projectName,
    version: "1.0.0",
    private: true,
    description: "TODO: Write a better description - New next.js project bootstrapped with next-launch 🛰️",
    keywords: [],
    scripts: commands.commands,
    dependencies: dependencies.dependencies,
    devDependencies: dependencies.devDependencies,
  };

  const stringifiedPackageJson: string = JSON.stringify(packageJson, null, 2);

  try {
    fs.writeFileSync(packageJsonPath, stringifiedPackageJson);
  } catch (error: unknown) {
    console.error(`TODO: An error occurred while writing the package.json`);
    if (globalThis.isVerbose) {
      console.error(error);
    }
  }
}

export async function generateGitIgnore(ignore: Ignores, projectDir: string): Promise<void> {
  const gitIgnorePath: string = path.join(projectDir, ".gitignore");
  const stringifiedIgnore: string = ignore.git;

  try {
    fs.writeFileSync(gitIgnorePath, stringifiedIgnore);
  } catch (error: unknown) {
    console.error(`TODO: An error occurred while writing the .gitignore`);
    if (globalThis.isVerbose) {
      console.error(error);
    }
  }
}
