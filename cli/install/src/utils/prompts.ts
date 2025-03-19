import { CANCEL_MESSAGE } from "../constants.js";
import { directoryExistsSync } from "../lib/fs.js";
import { confirm, checkbox, select, input } from "@inquirer/prompts";

export async function booleanPrompt(message: string, initialValue: boolean): Promise<boolean> {
  try {
    const response = await confirm({
      message: message,
      default: initialValue,
    });

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
  options: { name: string; message: string; value: string; requires: string[] }[],
): Promise<string[]> {
  try {
    const choices = options.map((option) => ({
      name: option.message || option.name,
      value: option.value,
    }));

    const selectedOptions = await checkbox({
      message,
      choices,
      validate: (selectedValues) => {
        for (const selected of selectedValues) {
          const option = options.find((opt) => opt.value === selected.value);

          if (option && option.requires && option.requires.length > 0) {
            const missingDependencies = option.requires.filter(
              (req) =>
                !selectedValues.includes({
                  value: req,
                }),
            );

            if (missingDependencies.length > 0) {
              const missingNames = missingDependencies.map((dep) => {
                const depOption = options.find((opt) => opt.value === dep);
                return depOption ? depOption.name : dep;
              });

              return `L'option "${option.name}" nécessite que vous sélectionniez également: ${missingNames.join(", ")}`;
            }
          }
        }

        return true;
      },
    });

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
