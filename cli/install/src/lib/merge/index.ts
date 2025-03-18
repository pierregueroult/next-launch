import {
  type PatchFiles,
  type PatchFilesAst,
  type PatchFilesConcat,
  type PatchFilesJson,
  patchFilesSchema,
} from "../../schemas/patchFiles.js";
import { applyAstMerge } from "./ast.js";
import { applyConcatMerge } from "./concat.js";
import { applyJsonMerge } from "./json.js";
import * as fs from "node:fs";
import { ZodError } from "zod";

export async function mergeFiles(source: string, destination: string): Promise<void> {
  const patch = source + ".patch.json";
  if (fs.existsSync(patch)) {
    const patchContent = fs.readFileSync(patch, "utf-8");
    let patchFile: PatchFiles;
    try {
      patchFile = patchFilesSchema.parse(JSON.parse(patchContent));
    } catch (error: unknown) {
      if (error instanceof ZodError && globalThis.isVerbose) {
        console.error(error.errors);
      }
      throw new Error(`Invalid patch file ${patch}`);
    }

    switch (patchFile.type) {
      case "ast":
        applyAstMerge(destination, patchFile as PatchFilesAst);
        break;
      case "concat":
        applyConcatMerge(destination, patchFile as PatchFilesConcat);
        break;
      case "json":
        applyJsonMerge(destination, patchFile as PatchFilesJson);
        break;
      default:
        throw new Error("Unknown patch file type");
    }
  } else {
    throw new Error(`Patch file not found, cannot merge files ${source} and ${destination}`);
  }
}
