import { PatchFilesJson } from "../../schemas/patchFiles.js";
import { readFileSync, writeFileSync } from "node:fs";

export function applyJsonMerge(targetPath: string, patch: PatchFilesJson): void {
  const targetContent = JSON.parse(readFileSync(targetPath, "utf-8"));
  const result = deepMerge(targetContent, patch.patch.content);
  writeFileSync(targetPath, JSON.stringify(result, null, 2));
}

function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(obj1: T, obj2: U): T & U {
  const result: Partial<T & U> = { ...(obj1 as Partial<T & U>) };

  for (const key in obj2) {
    if (Object.hasOwn(obj2, key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (
        typeof value1 === "object" &&
        typeof value2 === "object" &&
        value1 !== null &&
        value2 !== null &&
        !Array.isArray(value1) &&
        !Array.isArray(value2)
      ) {
        result[key] = deepMerge(value1 as Record<string, unknown>, value2 as Record<string, unknown>) as (T &
          U)[Extract<keyof U, string>];
      } else {
        result[key] = value2 as (T & U)[Extract<keyof U, string>];
      }
    }
  }

  return result as T & U;
}
