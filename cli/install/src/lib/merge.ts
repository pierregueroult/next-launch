import {
  type PatchFiles,
  type PatchFilesAst,
  type PatchFilesConcat,
  type PatchFilesJson,
  type PatchAstImport,
  type PatchAstJsxElement,
  type PatchAstJsxAttribute,
  patchFilesSchema,
} from "../schemas/patchFiles.js";
import * as fs from "node:fs";
import {
  type JsxAttribute,
  type JsxElement,
  type JsxSelfClosingElement,
  type SourceFile,
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

function applyAstMergeImports(sourceFile: SourceFile, imports: PatchAstImport[]): void {
  for (const imp of imports) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: imp.from,
      namedImports: imp.import ? imp.import : undefined,
    });
  }
}

function applyAstMergeJsxAttributes(sourceFile: SourceFile, attributes: PatchAstJsxAttribute[]): void {
  for (const attr of attributes) {
    const elements = findJsxElements(sourceFile, attr.selector);
    if (elements.length === 0) throw new Error("Element not found");
    elements.forEach((element) => modifyJsxAttribute(element, attr));
  }
}

function applyAstMergeJsxElements(sourceFile: SourceFile, elements: PatchAstJsxElement[]): void {
  for (const element of elements) {
    const parentElements = findJsxElements(sourceFile, element.parent.selector);
    if (parentElements.length === 0) throw new Error("Parent element not found");

    parentElements
      .filter((parentElement) => parentElement.getKind() === SyntaxKind.JsxElement)
      .forEach((parentElement) => {
        const parentBody = parentElement
          .getChildren()
          .filter((child) => {
            if (parentElement.getKind() === SyntaxKind.JsxElement) {
              const jsxElement = parentElement as JsxElement;
              return child !== jsxElement.getOpeningElement() && child !== jsxElement.getClosingElement();
            }
            return true;
          })
          .map((child) => child.getText())
          .join("\n");

        (parentElement as JsxElement).setBodyText(
          `${parentBody}${generateJsxFromElement(element.name, element.attributes)}`,
        );
      });
  }
}

export function applyAstMerge(targetPath: string, { patch }: PatchFilesAst): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(targetPath);

  if (patch.imports) {
    applyAstMergeImports(sourceFile, patch.imports);
  }

  if (patch.jsx?.attributes) {
    applyAstMergeJsxAttributes(sourceFile, patch.jsx.attributes);
  }

  if (patch.jsx?.elements) {
    applyAstMergeJsxElements(sourceFile, patch.jsx.elements);
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

function findJsxElements(sourceFile: SourceFile, selector: { element?: string; class?: string; id?: string }) {
  return sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement).filter((node) => {
    const tagname = node.getOpeningElement().getTagNameNode().getText();
    if (tagname !== selector.element) return false;

    const className = node.getOpeningElement().getAttribute("className")?.getText();
    const id = node.getOpeningElement().getAttribute("id")?.getText();

    if (selector.class && className !== selector.class) return false;
    if (selector.id && id !== selector.id) return false;

    return true;
  }) as (JsxElement | JsxSelfClosingElement)[];
}

function modifyJsxAttribute(
  element: JsxElement | JsxSelfClosingElement,
  attr: { name?: string; value?: string; actions?: string },
) {
  const openingElement =
    element.getKind() === SyntaxKind.JsxElement
      ? (element as JsxElement).getOpeningElement()
      : (element as JsxSelfClosingElement);
  const attribute = openingElement.getAttribute(attr.name);
  let value = attr.value;

  switch (attr.actions) {
    case "add":
      if (attribute && attribute.getKind() === SyntaxKind.JsxAttribute) {
        value = (attribute as JsxAttribute).getInitializerOrThrow().getText() + " " + value;
      }
      openingElement.addAttribute({ name: attr.name, initializer: `"${value}"` });
      break;
    case "replace":
      openingElement.insertAttribute(1, { name: attr.name, initializer: `"${value}"` });
      break;
    case "remove":
      attribute?.remove();
      break;
    default:
      throw new Error("Unknown action");
  }
}
