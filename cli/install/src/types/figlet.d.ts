declare module "figlet" {
  function text(txt: string, options?: unknown): Promise<string>;

  namespace text {}

  export { text };
}
