import yamlParser from "../utils/yaml-parser.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { Dependencies, YamlDependencies } from "src/types/dependencies.js";

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
