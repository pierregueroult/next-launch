export type Dependencies = {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
};

export type YamlDependencies = {
  dependencies: {
    name: string;
    version: string;
  }[];
  devDependencies: {
    name: string;
    version: string;
  }[];
};
