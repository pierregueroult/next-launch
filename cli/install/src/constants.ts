import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const BASE_PATH: string = join(dirname(fileURLToPath(import.meta.url)), "..");

export const CLI_NAME: string = "create-next-launch";

export const CLI_DESCRIPTION: string = "Create a new Next.js project with Launch";
