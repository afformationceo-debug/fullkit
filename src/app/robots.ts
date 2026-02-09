import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/leads", "/meetings", "/clients", "/projects", "/accounting", "/feedback", "/maintenance", "/deliverables", "/blog-admin", "/api/", "/login"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/blog/", "/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/blog/", "/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/blog/", "/"],
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
