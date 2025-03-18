import figlet from "figlet";
import gradient from "gradient-string";

const motdGradient = gradient(
  [
    "#ff9966",
    "#ff5e62",
    "#ff2a7d",
    "#ff00a5",
    "#ff00d4",
    "#ff00ff",
    "#d400ff",
    "#a500ff",
    "#7d00ff",
    "#6200ff",
    "#5e00ff",
    "#6600ff",
  ],
  { interpolation: "hsv" },
);

async function generateFigletText(text: string, font = "Rectangles"): Promise<string> {
  return figlet.text(text, {
    font,
    horizontalLayout: "default",
    verticalLayout: "default",
  });
}

export async function startMotd(): Promise<void> {
  const message = await generateFigletText("NEXT-LAUNCH");
  console.log(motdGradient(message));
}

export async function endMotd(name: string, manager: string): Promise<void> {
  const message = await generateFigletText("OK");
  const managerMessage = manager === "npm " ? "npm run dev" : `${manager} dev`;
  const coloredMessage = motdGradient(message);
  const lines = coloredMessage.split("\n");

  if (lines.length > 3) {
    lines[2] += "   \x1b[0mYour project is now ready! 🚀";
    lines[3] += `   \x1b[1m\x1b[36mRun "cd ${name} && ${managerMessage}" to start working on your project`;
  }

  console.log(lines.join("\n"));
}
