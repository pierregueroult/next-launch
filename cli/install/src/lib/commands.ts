import { Commands } from "../types/commands.js";
import yamlParser from "../utils/yaml-parser.js";
import * as fs from "node:fs";
import * as path from "node:path";

export async function addCommands(commands: Commands, packageDir: string): Promise<Commands> {
  const filePath: string = path.join(packageDir, "commands.yaml");

  if (fs.existsSync(filePath)) {
    const newCommands: Commands = yamlParser.readYamlSync<Commands>(filePath);

    return {
      ...commands,
      ...newCommands,
    };
  } else {
    return commands;
  }
}
