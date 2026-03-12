import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/auth/", "/dashboard/", "/invoice/", "/share/"],
      },
    ],
    sitemap: "https://invoicequickly.com/sitemap.xml",
  };
}
