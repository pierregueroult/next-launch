import {
  PatchFiles,
  type PatchFilesAst,
  type PatchFilesConcat,
  type PatchFilesJson,
  patchFilesSchema,
} from "../schemas/patchFiles.js";
import * as fs from "node:fs";
import {
  type JsxAttribute,
  type JsxElement,
  type JsxSelfClosingElement,
  type JsxSpreadAttribute,
  Project,
  SyntaxKind,
} from "ts-morph";
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

export function applyAstMerge(targetPath: string, { patch }: PatchFilesAst): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(targetPath);

  if (patch.imports) {
    for (const imp of patch.imports) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: imp.from,
        namedImports: imp.import ? imp.import : undefined,
      });
    }
  }

  if (patch.jsx && patch.jsx.attributes) {
    for (const attr of patch.jsx.attributes) {
      const elements: (JsxElement | JsxSelfClosingElement)[] = [];

      sourceFile.forEachDescendant((node) => {
        if (node.getKind() === SyntaxKind.JsxElement) {
          const element = node as JsxElement;
          const tagname = element.getOpeningElement().getTagNameNode().getText();
          if (tagname === attr.selector.element) {
            if (
              attr.selector.class &&
              element.getOpeningElement().getAttribute("className")?.getText() !== attr.selector.class
            ) {
              return;
            } else if (
              attr.selector.id &&
              element.getOpeningElement().getAttribute("id")?.getText() !== attr.selector.id
            ) {
              return;
            }
            elements.push(element);
          }
        } else if (node.getKind() === SyntaxKind.JsxSelfClosingElement) {
          const element = node as JsxSelfClosingElement;
          const tagname = element.getTagNameNode().getText();
          if (tagname === attr.selector.element) {
            if (attr.selector.class && element.getAttribute("className")?.getText() !== attr.selector.class) {
              return;
            } else if (attr.selector.id && element.getAttribute("id")?.getText() !== attr.selector.id) {
              return;
            }
            elements.push(element);
          }
        }
      });

      if (elements.length === 0) {
        throw new Error("Element not found");
      }

      elements.forEach((element) => {
        let attribute: JsxAttribute | JsxSpreadAttribute | undefined;
        let value = attr.value;

        if (element.getKind() === SyntaxKind.JsxElement) {
          attribute = (element as JsxElement).getOpeningElement().getAttribute(attr.name);
        } else {
          attribute = (element as JsxSelfClosingElement).getAttribute(attr.name);
        }

        switch (attr.actions) {
          case "add":
            if (attribute) {
              if (attribute.getKind() === SyntaxKind.JsxAttribute) {
                value = (attribute as JsxAttribute).getInitializerOrThrow().getText() + " " + value;
              }
            }
            if (element.getKind() === SyntaxKind.JsxElement) {
              (element as JsxElement).getOpeningElement().addAttribute({
                name: attr.name,
                initializer: `"${value}"`,
              });
            } else {
              (element as JsxSelfClosingElement).addAttribute({
                name: attr.name,
                initializer: `"${value}"`,
              });
            }
            break;
          case "replace":
            if (element.getKind() === SyntaxKind.JsxElement) {
              (element as JsxElement).getOpeningElement().insertAttribute(1, {
                name: attr.name,
                initializer: `"${value}"`,
              });
            } else {
              (element as JsxSelfClosingElement).insertAttribute(1, {
                name: attr.name,
                initializer: `"${value}"`,
              });
            }

            break;
          case "remove":
            if (attribute) {
              attribute.remove();
            }
            break;
          default:
            throw new Error("Unknown action");
        }
      });
    }
  }

  if (patch.jsx && patch.jsx.elements) {
    for (const element of patch.jsx.elements) {
      const parentElement = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement).find((node) => {
        const tagname = node.getOpeningElement().getTagNameNode().getText();
        if (tagname === element.parent.selector.element) {
          if (
            element.parent.selector.class &&
            node.getOpeningElement().getAttribute("className")?.getText() !== element.parent.selector.class
          ) {
            return false;
          } else if (
            element.parent.selector.id &&
            node.getOpeningElement().getAttribute("id")?.getText() !== element.parent.selector.id
          ) {
            return false;
          }
          return true;
        }
        return false;
      });

      if (!parentElement) {
        throw new Error("Parent element not found");
      }

      const parentBody = parentElement
        .getChildren()
        .filter((child) => child !== parentElement.getOpeningElement() && child !== parentElement.getClosingElement())
        .map((child) => child.getText())
        .join("\n");

      parentElement.setBodyText(`${parentBody}${generateJsxFromElement(element.name, element.attributes)}`);
    }
  }

  sourceFile.saveSync();
}

// TODO: Implement the following functions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applyConcatMerge(targetPath: string, patch: PatchFilesConcat): void {}

// TODO: Implement the following functions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applyJsonMerge(targetPath: string, patch: PatchFilesJson): void {}

function generateJsxFromElement(name: string, attributes: { value?: string; name?: string }[]) {
  // TODO: Handle the case where the element has children
  const attr = attributes
    .map((attr) => {
      if (attr.value) return `${attr.name}="${attr.value}"`;
      return attr.name;
    })
    .filter(Boolean)
    .join(" ");

  if (attr) return `<${name} ${attr}/>`;
  return `<${name}/>`;
}
