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

export type YamlCommands = {
  commands: [
    {
      [command: string]: string;
    },
  ];
};

export type Commands = {
  commands: {
    [command: string]: string;
  };
};

export type Ignores = {
  git: string;
};
