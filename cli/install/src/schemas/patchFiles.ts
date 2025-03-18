import { z } from "zod";

export const patchFilesSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ast"),
    file: z.string(),
    patch: z.object({
      imports: z.array(
        z.object({
          from: z.string(),
          import: z.array(z.string()).optional(),
        }),
      ),
      jsx: z.object({
        attributes: z.array(
          z.object({
            component: z.string(),
            selector: z.object({
              element: z.string(),
              id: z.string().optional(),
              class: z.string().optional(),
            }),
            name: z.string(),
            actions: z.enum(["add", "replace", "remove"]),
            value: z.string().optional(),
          }),
        ),
      }),
    }),
  }),
  z.object({
    type: z.literal("concat"),
    file: z.string(),
    patch: z.object({}),
  }),
  z.object({
    type: z.literal("json"),
    file: z.string(),
    patch: z.object({}),
  }),
]);

export type PatchFiles = z.infer<typeof patchFilesSchema>;

export type PatchFilesAst = PatchFiles & { type: "ast" };
export type PatchFilesConcat = PatchFiles & { type: "concat" };
export type PatchFilesJson = PatchFiles & { type: "json" };
