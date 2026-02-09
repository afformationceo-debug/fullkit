import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fullkit.kr";
  const supabase = await createClient();

  // Fetch published posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, published_at, category")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (posts || []).map((post) => ({
    title: String(post.title || ""),
    slug: String(post.slug || ""),
    excerpt: String(post.excerpt || ""),
    publishedAt: String(post.published_at || new Date().toISOString()),
    category: String(post.category || "인사이트"),
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Full Kit 블로그</title>
    <link>${baseUrl}/blog</link>
    <description>홈페이지 제작, 앱 개발, 솔루션, 자동화에 대한 유용한 인사이트</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/blog/rss" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <category>${escapeXml(post.category)}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
