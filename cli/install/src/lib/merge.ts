import { structuredPatch } from "diff";
import fs from "node:fs";

export function mergeFiles(oldPath: string, lastPath: string): string {
  const source: string = fs.readFileSync(oldPath, "utf-8");
  const last: string = fs.readFileSync(lastPath, "utf-8");
  const patch = structuredPatch("A", "B", source, last, "", "");

  if (patch.hunks.length === 0) {
    return last;
  }

  patch.hunks.forEach((hunk) => {
    console.log(hunk.lines);
  });
}
