import { z } from "zod";

export type PackageManagers = "pnpm" | "npm" | "yarn";

export const packageManagers: PackageManagers[] = ["pnpm", "npm", "yarn"];

export const packageManagersSchema = z.array(z.enum(["pnpm", "npm", "yarn"]));
