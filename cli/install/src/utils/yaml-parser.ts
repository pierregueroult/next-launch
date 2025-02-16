import { readFileSync, promises as fsPromises } from "fs";
import * as yaml from "js-yaml";

interface YamlParser {
  readYamlSync: <T>(filePath: string) => T;
  readYamlAsync: <T>(filePath: string) => Promise<T>;
}

const yamlParser: YamlParser = {
  readYamlSync: <T>(filePath: string): T => {
    try {
      const fileContents = readFileSync(filePath, "utf8");
      const data = yaml.load(fileContents) as T;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          throw new Error(`TODO: File not found: ${filePath}`);
        }
        if (error.name === "YAMLException") {
          throw new Error(`TODO: Invalid YAML syntax: ${error.message}`);
        }
      }
      throw error;
    }
  },

  readYamlAsync: async <T>(filePath: string): Promise<T> => {
    try {
      const fileContents = await fsPromises.readFile(filePath, "utf8");
      const data = yaml.load(fileContents) as T;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          throw new Error(`TODO: File not found: ${filePath}`);
        }
        if (error.name === "YAMLException") {
          throw new Error(`TODO: Invalid YAML syntax: ${error.message}`);
        }
      }
      throw error;
    }
  },
};

export default yamlParser;
