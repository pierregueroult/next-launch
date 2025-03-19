import { PatchFilesConcat } from "../../schemas/patchFiles.js";
import { readFileSync, writeFileSync } from "node:fs";

export function applyConcatMerge(targetPath: string, patch: PatchFilesConcat): void {
  const targetContent = readFileSync(targetPath, "utf-8");
  const { content, position } = patch.patch;

  const newContent = position === "before" ? `${content}\n${targetContent}` : `${targetContent}\n${content}`;

  writeFileSync(targetPath, newContent);
}
