import { z } from "zod";

export const patchFilesSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ast"),
    file: z.string(),
    patch: z.object({
      imports: z
        .array(
          z.object({
            from: z.string(),
            import: z.array(z.string()).optional(),
          }),
        )
        .optional(),
      jsx: z.object({
        attributes: z
          .array(
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
          )
          .optional(),
        elements: z
          .array(
            z.object({
              name: z.string(),
              attributes: z.array(
                z.object({
                  name: z.string(),
                  value: z.string().optional(),
                }),
              ),
              children: z.array(z.string()),
              parent: z.object({
                component: z.string(),
                selector: z.object({
                  element: z.string(),
                  id: z.string().optional(),
                  class: z.string().optional(),
                }),
              }),
            }),
          )
          .optional(),
      }),
    }),
  }),
  z.object({
    type: z.literal("concat"),
    file: z.string(),
    patch: z.object({
      content: z.string(),
      position: z.enum(["before", "after"]),
    }),
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

export type PatchAstImport = PatchFilesAst["patch"]["imports"][number];
export type PatchAstJsxAttribute = PatchFilesAst["patch"]["jsx"]["attributes"][number];
export type PatchAstJsxElement = PatchFilesAst["patch"]["jsx"]["elements"][number];
