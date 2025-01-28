import next from "next";
import express from "express";

const dev: boolean = process.env.NODE_ENV === "development";
const hostname: string = process.env.HOST_NAME || "localhost";
const port: number = parseInt(process.env.PORT ?? "3000", 10);
const turbo: boolean = process.env.TURBO === "true";

const app = next({ dev, hostname, port, turbo });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.all("*", (req, res) => handle(req, res));
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀 Next-launch: ${dev ? "Development" : "Production"} server listening on http://${hostname}:${port}`,
      );
    });
  })
  .catch((err: any) => {
    // eslint-disable-next-line no-console
    console.log("⚡Next-launch: Error occured while starting the server: ", err);
    process.exit(1);
  });
