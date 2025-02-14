import { CANCEL_MESSAGE } from "../constants.js";
import { confirm, isCancel, cancel, select, text } from "@clack/prompts";

export async function booleanPrompt(message: string, initialValue: boolean): Promise<boolean> {
  const response: boolean | symbol = await confirm({
    message,
    initialValue,
  });

  if (isCancel(response)) {
    cancel(CANCEL_MESSAGE);
    process.exit(0);
  }

  return response === true;
}

export async function selectPrompt(
  message: string,
  options: { label: string; value: string }[],
  initialValue: string,
): Promise<string> {
  const response: string | symbol = await select({
    message,
    options,
    initialValue,
  });

  if (isCancel(response)) {
    cancel(CANCEL_MESSAGE);
    process.exit(0);
  }

  return response;
}

export async function textPrompt(message: string, initialValue: string, placeholder: string): Promise<string> {
  const response: string | symbol = await text({
    message,
    initialValue,
    placeholder,
    validate: (value: string) => {
      if (value.length === 0) return "Please enter a string with at least one character";
      if (value.includes(" ")) return "Please enter a string without spaces";
      if (!/^[a-zA-Z0-9-]+$/.test(value)) return "Please enter a string without special characters";
    },
  });

  if (isCancel(response)) {
    cancel(CANCEL_MESSAGE);
    process.exit(0);
  }

  return response;
}
