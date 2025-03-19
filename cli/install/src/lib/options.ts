import { BASE_PATH } from "../constants.js";
import type { YamlManifest } from "../types/manifest.js";
import yamlParser from "../utils/yaml-parser.js";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

export function getAllOptions(): (YamlManifest & {
  value: string;
})[] {
  const path = join(BASE_PATH, "starter", "options");
  const options: (YamlManifest & {
    value: string;
  })[] = [];

  const directories = readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => join(path, dirent.name));

  for (const dir of directories) {
    const manifestPath = join(dir, "manifest.yaml");
    if (existsSync(manifestPath)) {
      const parsedYaml = yamlParser.readYamlSync<YamlManifest>(manifestPath);
      options.push({
        ...parsedYaml,
        value: parsedYaml.name,
      });
    }
  }

  return options;
}
