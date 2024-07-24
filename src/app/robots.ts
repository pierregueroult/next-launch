import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/your/very/private/and/secret/page",
    },
    sitemap: "https://next-launch-demo.pierregueroult.tech/sitemap.xml",
  };
}
