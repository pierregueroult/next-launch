import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next Launch",
    short_name: "Next Launch",
    description:
      "A free and open source web app boilerplate based on Next.js, offering you an easy way to get started with your next project.",
    theme_color: "#000000",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "any",
    scope: "/",
    start_url: "/",
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
