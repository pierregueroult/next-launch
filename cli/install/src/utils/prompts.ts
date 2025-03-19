import { CANCEL_MESSAGE } from "../constants.js";
import { directoryExistsSync } from "../lib/fs.js";
import { confirm, checkbox, select, input } from "@inquirer/prompts";

export async function booleanPrompt(message: string, initialValue: boolean): Promise<boolean> {
  try {
    const response = await confirm({
      message: message,
      default: initialValue,
    });

    printPipe(2);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(CANCEL_MESSAGE);
      process.exit(0);
    } else {
      throw error;
    }
  }
}

export async function selectPrompt(
  message: string,
  options: { label: string; value: string }[],
  initialValue: string,
): Promise<string> {
  try {
    const response = await select({
      message: message,
      choices: options.map((option) => ({ name: option.label, value: option.value })),
      default: options.find((option) => option.value === initialValue)?.label,
    });

    printPipe(2);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(CANCEL_MESSAGE);
      process.exit(0);
    } else {
      throw error;
    }
  }
}

export async function projectNamePrompt(message: string, initialValue: string): Promise<string> {
  try {
    const response = await input({
      message: message,
      default: initialValue,
      validate: (value: string): true | string => {
        if (value.length === 0) return "Please enter a string with at least one character";
        if (value.includes(" ")) return "Please enter a string without spaces";
        if (!/^[a-zA-Z0-9-]+$/.test(value)) return "Please enter a string without special characters";
        if (directoryExistsSync(value)) return "A directory with that name already exists";
        return true;
      },
    });
    printPipe(2);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(CANCEL_MESSAGE);
      process.exit(0);
    } else {
      throw error;
    }
  }
}

export async function projectOptionsPrompt(
  message: string,
  options: { message: string; value: string; requires: string[] }[],
  selected?: string[],
): Promise<string[]> {
  try {
    const choices = options.map((option) => ({
      name: option.message,
      value: option.value,
      checked: selected?.includes(option.value) ?? false,
    }));

    const selectedOptions = await checkbox({
      message: `${message} \n (Use ↑/↓ to navigate, space to select, enter to confirm)`,
      choices,
      instructions: false,
      validate: (selectedValues) => {
        for (const selected of selectedValues) {
          const option = options.find((opt) => opt.value === selected.value);

          if (option.requires.length > 0) {
            for (const required of option.requires) {
              if (!selectedValues.find((selected) => selected.value === required)) {
                return `The option "${option.message}" requires "${options.find((opt) => opt.value === required)?.message}"`;
              }
            }
          }
        }

        return true;
      },
    });

    printPipe(2);
    return selectedOptions;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(CANCEL_MESSAGE);
      process.exit(0);
    } else {
      throw error;
    }
  }
}

function printPipe(count: number) {
  for (let i = 0; i < count; i++) {
    console.log("\x1b[90m%s\x1b[0m", "⎜");
  }
}
