import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const published: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Find posts with status 'scheduled' and scheduled_for <= now
    const now = new Date().toISOString();
    const { data: scheduledPosts } = await supabase
      .from("blog_posts")
      .select("id, title, slug")
      .eq("status", "scheduled")
      .lte("scheduled_for", now);

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts to publish",
        published: 0,
      });
    }

    // 2. Update each post to 'published'
    for (const post of scheduledPosts) {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          status: "published",
          published_at: now,
        })
        .eq("id", post.id);

      if (error) {
        errors.push(`Failed to publish "${post.title}": ${error.message}`);
      } else {
        published.push(String(post.title));
        // Update linked keyword status to published
        await supabase
          .from("blog_keywords")
          .update({ status: "published" })
          .eq("blog_post_id", post.id);
      }
    }

    // 3. Revalidate blog pages so new content appears immediately
    if (published.length > 0) {
      revalidatePath("/blog");
      for (const post of scheduledPosts) {
        revalidatePath(`/blog/${String(post.slug)}`);
      }
    }

    // 4. Ping Google for indexing (best-effort)
    if (published.length > 0 && process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        const sitemapUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`;
        await fetch(
          `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
          { method: "GET" }
        );
      } catch {
        // Non-critical, ignore
      }
    }

    return NextResponse.json({
      success: true,
      message: `Published ${published.length} posts`,
      published: published.length,
      titles: published,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error("Blog publish error:", e);
    return NextResponse.json(
      { error: "Blog publish failed", details: e instanceof Error ? e.message : "" },
      { status: 500 }
    );
  }
}
