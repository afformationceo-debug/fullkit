import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io";
  const supabase = await createClient();

  // Fetch published posts with content for content:encoded
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, content, published_at, category, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (posts || []).map((post) => ({
    title: String(post.title || ""),
    slug: String(post.slug || ""),
    excerpt: String(post.excerpt || ""),
    content: String(post.content || ""),
    publishedAt: String(post.published_at || new Date().toISOString()),
    category: String(post.category || "인사이트"),
    coverImageUrl: post.cover_image_url ? String(post.cover_image_url) : null,
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>WhyKit 블로그</title>
    <link>${baseUrl}/blog</link>
    <description>홈페이지 제작, 앱 개발, 솔루션, 자동화에 대한 유용한 인사이트</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/blog/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>WhyKit 블로그</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${items
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <category>${escapeXml(post.category)}</category>${
          post.coverImageUrl
            ? `
      <enclosure url="${escapeXml(post.coverImageUrl)}" type="image/png" length="0"/>`
            : ""
        }
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
