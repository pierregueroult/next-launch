#!/usr/bin/env node
import cp from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

// convert libs to promises
const exec = promisify(cp.exec);
const rm = promisify(fs.rm);

if (process.argv.length < 3) {
  console.log("You have to provide a name to your app.");
  console.log("For example :");
  console.log("    npx next-launcher my-greatest-app-ever");
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/pierregueroult/next-launch.git";

// create project directory
if (fs.existsSync(projectPath)) {
  console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
  process.exit(1);
} else {
  fs.mkdirSync(projectPath);
}

try {
  await exec(`git clone --depth 1 ${git_repo} ${projectPath} --quiet`);

  const rmGit = rm(path.join(projectPath, ".git"), { recursive: true, force: true });
  const rmBin = rm(path.join(projectPath, "bin"), { recursive: true, force: true });

  await Promise.all([rmGit, rmBin]);

  process.chdir(projectPath);

  await exec("npm install");

  console.log("The installation is done!");
  console.log("You can now run your app with:");
  console.log(`    cd ${projectName}`);
  console.log(`    npm run dev`);
} catch (error) {
  fs.rmSync(projectPath, { recursive: true, force: true });
  console.log(error);
}
