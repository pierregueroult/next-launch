import { packageManagers } from "./managers.js";
import { z } from "zod";

const optionsSchema = z
  .object({
    name: z.string().nonempty().optional(),
    "package-manager": z.enum(packageManagers as [string, ...string[]]).optional(),
    git: z.boolean().optional(),
    install: z.boolean().optional(),
  })
  .catchall(z.boolean().optional());

export { optionsSchema };

export type Options = z.infer<typeof optionsSchema>;
