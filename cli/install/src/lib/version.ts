import { BASE_PATH } from "../constants.js";
import fs from "node:fs";

export function getCliVersion(): string {
  try {
    const packageJson = JSON.parse(fs.readFileSync(`${BASE_PATH}/package.json`, "utf-8"));
    return typeof packageJson.version === "string" ? packageJson.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}
