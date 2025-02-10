#!/usr/bin/env node
import chalk from "chalk";
import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { promisify } from "node:util";
import ora from "ora";
import simpleGit from "simple-git";

const exec = promisify(cp.exec);
const git = simpleGit();

console.log(
  chalk.yellow(`
 _____ _____ __ __ _____     __    _____ _____ _____ _____ _____ 
|   | |   __|  |  |_   _|___|  |  |  _  |  |  |   | |     |  |  |
| | | |   __|-   -| | | |___|  |__|     |  |  | | | |   --|     |
|_|___|_____|__|__| |_|     |_____|__|__|_____|_|___|_____|__|__|
`),
);

if (process.argv.length < 3) {
  console.log(chalk.white("You better give a name to your project, pretty sure it's dope!"));
  console.log(chalk.gray("For example :"));
  console.log(`    ${chalk.gray("npx next-launch i-love-next-launch-project <3")}`);
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const gitRepo = "https://github.com/pierregueroult/next-launch.git";

if (fs.existsSync(projectPath)) {
  console.log(
    chalk.white(
      `The folder ${chalk.red(projectName)} already exists in the current directory, too bad, try another name!`,
    ),
  );
  process.exit(1);
} else {
  fs.mkdirSync(projectPath);
}

console.log(chalk.white("🚀 Setup process started :"));

const cloning = ora("▶ Cloning the project repository ...").start();

await git.clone(gitRepo, projectPath, ["--progress"], () => {});

cloning.succeed(chalk.green("📦 Project repository cloned"));

process.chdir(projectPath);

const cleaning = ora("▶ Cleaning install files ...").start();

await Promise.all([
  // Remove our git history
  fs.promises.rm(path.join(projectPath, ".git"), { recursive: true, force: true }),
  // Remove the bin folder that contains the install script
  fs.promises.rm(path.join(projectPath, "bin"), { recursive: true, force: true }),
  // Remove our sonarqube build and analysis action
  fs.promises.rm(path.join(projectPath, ".github/workflows/build.yml"), { force: true }),
  // Remove our sonarqube configuration
  fs.promises.rm(path.join(projectPath, "sonar-project.properties"), { force: true }),
  // Remove our sonarqube folder
  fs.promises.rm(path.join(projectPath, ".sonar"), { recursive: true, force: true }),
]);

cleaning.succeed(chalk.green("🧹 Install files cleaned"));

let installer = "pnpm";
const install = ora("▶ Installing dependencies ... (takes a while bth)").start();

try {
  await exec("pnpm --version");

  install.text = "📜 Installing dependencies with pnpm ... (can take a while tbh)";

  await exec("pnpm install");

  install.succeed(chalk.green("📜 Dependencies installed successfully!"));
} catch (error) {
  install.warn(chalk.yellow("🚨 pnpm not found, falling back to npm"));
  await sleep(500);
  install.start();

  try {
    await exec("npm --version");

    install.text = "📜 Installing dependencies with npm ... (can take a while tbh)";

    await exec("npm install --legacy-peer-deps");
    installer = "npm";

    install.succeed(chalk.green("📜 Dependencies installed successfully!"));
  } catch (error) {
    install.fail(chalk.red("🚨 An error occured while installing dependencies"));
    console.log(chalk.red(error));
    console.log(chalk.white("    You can try to install them manually by running:"));
    console.log(chalk.white(`        cd ${projectName} && npm install`));
  }
}

const cleanup = ora("🧹 Removing setup dependencies (they're not needed anymore)").start();

try {
  if (installer === "pnpm") {
    await exec("pnpm remove ora chalk simple-git");
  } else {
    await exec("npm remove ora chalk simple-git --legacy-peer-deps");
  }
  cleanup.succeed(chalk.green("✅ Setup dependencies removed"));
} catch (error) {
  cleanup.fail(chalk.red("❌ Failed to remove setup dependencies"));
  console.log(chalk.white("    You can manually remove them by running:"));
  console.log(chalk.white(`        pnpm remove ora chalk simple-git`));
}

console.log(chalk.yellow("\n🎉 The installation is complete!"));
console.log(chalk.white(`    You can now run: cd ${projectName} && npm run dev\n`));
