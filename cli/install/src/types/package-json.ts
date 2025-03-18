export type Person =
  | {
      name: string;
      email?: string;
      url?: string;
    }
  | string;

export type PublishConfig = {
  registry?: string;
  access?: "public" | "restricted";
  tag?: string;
  directory?: string;
} & Partial<{
  bin: string | Record<string, string>;
  browser: string;
  main: string;
  module: string;
  types: string;
}>;

export type PackageJson = {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: {
    url?: string;
    email?: string;
  };
  license?: string;
  author?: Person | string;
  contributors?: (Person | string)[];
  files?: string[];
  main?: string;
  browser?: string;
  bin?: {
    [key: string]: string;
  };
  repository?: {
    type: string;
    url: string;
  };
  scripts?: {
    [key: string]: string;
  };
  dependencies?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
  peerDependencies?: {
    [key: string]: string;
  };
  optionalDependencies?: {
    [key: string]: string;
  };
  engines?: {
    node?: string;
    npm?: string;
  };
  private?: boolean;
  publishConfig?: PublishConfig;
  workspaces?: string[];
};
