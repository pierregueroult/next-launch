import { packageManagers } from "./managers.js";
import { z } from "zod";

export const optionsSchema = z.object({
  name: z.string().nonempty().optional(),
  tailwind: z
    .boolean({
      message: "The --tailwind flag must be a boolean",
    })
    .optional(),
  git: z
    .boolean({
      message: "The --git flag must be a boolean",
    })
    .optional(),
  install: z
    .boolean({
      message: "The --install flag must be a boolean",
    })
    .optional(),
  "package-manager": z.enum(packageManagers as [string, ...string[]]).optional(),
  emails: z
    .boolean({
      message: "The --emails flag must be a boolean",
    })
    .optional(),
});

export type Options = z.infer<typeof optionsSchema>;

export const requiredOptionsSchema = optionsSchema.required();

export type RequiredOptions = z.infer<typeof requiredOptionsSchema>;
