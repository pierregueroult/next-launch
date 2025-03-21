import {
  PatchAstImport,
  PatchAstJsxAttribute,
  PatchAstJsxDeclaration,
  PatchAstJsxElement,
  PatchAstJsxProvider,
  PatchFilesAst,
} from "../../schemas/patchFiles.js";
import { JsxAttribute, JsxElement, JsxSelfClosingElement, Project, SourceFile, SyntaxKind } from "ts-morph";

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
      if (attribute && attribute.getKind() === SyntaxKind.JsxAttribute) {
        (attribute as JsxAttribute).setInitializer(`${value}`);
      }
      break;
    case "remove":
      attribute?.remove();
      break;
    default:
      throw new Error("Unknown action");
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

function applyAstMergeJsxProviders(sourceFile: SourceFile, providers: PatchAstJsxProvider[]): void {
  for (const provider of providers) {
    const parentsElements = findJsxElements(sourceFile, provider.parent.selector);

    if (parentsElements.length === 0) throw new Error("Element not found");

    parentsElements.forEach((parentElement) => {
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

      const attributes: string = Object.entries(provider.props || {})
        .map(([key, value]) => `${key}=${value}`)
        .join(" ");

      (parentElement as JsxElement).setBodyText(
        `<${provider.component} ${attributes}>${parentBody}</${provider.component}>`,
      );
    });
  }
}

function applyAstMergeJsxDeclarations(sourceFile: SourceFile, declarations: PatchAstJsxDeclaration[]): void {
  const sortedDeclarations = declarations.sort((a, b) => a.priority + b.priority);

  for (const declaration of sortedDeclarations) {
    const component = sourceFile.getFunctions().find((func) => func.getName() === declaration.component);
    if (!component) throw new Error("Component not found");

    const body = component.getBodyText();
    component.setBodyText(`${declaration.content}\n${body}`);
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

  if (patch.jsx?.providers) {
    applyAstMergeJsxProviders(sourceFile, patch.jsx.providers);
  }

  if (patch.jsx?.declarations) {
    applyAstMergeJsxDeclarations(sourceFile, patch.jsx.declarations);
  }

  sourceFile.saveSync();
}
