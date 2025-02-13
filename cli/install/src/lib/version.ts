import { BASE_PATH } from "../constants.js";
import fs from "node:fs";

export function getCliVersion(): string {
  const packageContent: string = fs.readFileSync(`${BASE_PATH}/package.json`, "utf-8");
  const packageJson = JSON.parse(packageContent);

  return packageJson.version;
}
