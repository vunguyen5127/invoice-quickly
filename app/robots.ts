import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/auth/",
          "/dashboard/",
          "/invoice/",
          "/share/",
          "/api/",
          "/login",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/dashboard/", "/invoice/", "/share/"],
      },
    ],
    sitemap: "https://invoice-quickly.com/sitemap.xml",
  };
}
