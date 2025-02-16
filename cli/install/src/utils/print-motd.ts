import figlet from "figlet";
import gradient from "gradient-string";

export default async function printMotd(): Promise<void> {
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

  const message: Promise<string> = figlet.text("NEXT-LAUNCH", {
    font: "Rectangles",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  console.log(motdGradient(await message));
}
