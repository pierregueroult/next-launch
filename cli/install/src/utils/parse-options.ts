import { optionsSchema, requiredOptionsSchema, Options, RequiredOptions } from "../schemas/options.js";

export function parseOptions(options: unknown): Options {
  try {
    return optionsSchema.parse(options);
  } catch (error: unknown) {
    console.error("An error occurred while parsing the options. Exiting...");
    if (globalThis.isVerbose) console.error(error);
    process.exit(1);
  }
}

export function parseRequiredOptions(options: Options): RequiredOptions {
  try {
    return requiredOptionsSchema.parse(options);
  } catch (error: unknown) {
    console.error("An error occurred while parsing the required options. Exiting...");
    if (globalThis.isVerbose) console.error(error);
    process.exit(1);
  }
}
