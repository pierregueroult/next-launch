import { optionsSchema } from "../schemas/options.js";
import { z } from "zod";

export default function parseOptions(options: unknown): z.infer<typeof optionsSchema> {
  try {
    return optionsSchema.parse(options);
  } catch (error: unknown) {
    console.error("An error occurred while parsing the options. Exiting...");
    if (globalThis.isVerbose) console.error(error);
    process.exit(1);
  }
}
