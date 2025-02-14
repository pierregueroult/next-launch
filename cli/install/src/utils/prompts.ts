import { CANCEL_MESSAGE } from "../constants.js";
import { confirm, isCancel, cancel, select } from "@clack/prompts";

export async function booleanPrompt(message: string, initial: boolean): Promise<boolean> {
  const response: boolean | symbol = await confirm({
    message,
    initialValue: initial,
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
  initial: string,
): Promise<string> {
  const response: string | symbol = await select({
    message,
    options,
    initialValue: initial,
  });

  if (isCancel(response)) {
    cancel(CANCEL_MESSAGE);
    process.exit(0);
  }

  return response;
}
