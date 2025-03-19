import { CANCEL_MESSAGE } from "../constants.js";
import { directoryExistsSync } from "../lib/fs.js";
import Enquirer from "enquirer";

export async function booleanPrompt(message: string, initialValue: boolean): Promise<boolean> {
  try {
    const response = await Enquirer.prompt<{
      confirmation: boolean;
    }>({
      type: "confirm",
      message: message,
      initial: initialValue,
      name: "confirmation",
    });

    return response.confirmation;
  } catch {
    console.log(CANCEL_MESSAGE);
    process.exit(0);
  }
}

export async function selectPrompt(
  message: string,
  options: { label: string; value: string }[],
  initialValue: string,
): Promise<string> {
  try {
    const response = await Enquirer.prompt<{
      selection: string;
    }>({
      type: "select",
      name: "selection",
      message: message,
      choices: options.map((option) => ({ name: option.label, value: option.value })),
      initial: options.findIndex((option) => option.value === initialValue),
    });

    return options.find((option) => option.label === response.selection)?.value || "";
  } catch {
    console.log(CANCEL_MESSAGE);
    process.exit(0);
  }
}

export async function projectNamePrompt(message: string, initialValue: string): Promise<string> {
  try {
    const response = await Enquirer.prompt<{
      projectName: string;
    }>({
      type: "input",
      name: "projectName",
      message: message,
      initial: initialValue,
      validate: (value: string) => {
        if (value.length === 0) return "Please enter a string with at least one character";
        if (value.includes(" ")) return "Please enter a string without spaces";
        if (!/^[a-zA-Z0-9-]+$/.test(value)) return "Please enter a string without special characters";
        if (directoryExistsSync(value)) return "A directory with that name already exists";
        return true;
      },
    });

    return response.projectName;
  } catch {
    console.log(CANCEL_MESSAGE);
    process.exit(0);
  }
}
