import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateBlogPost, validateBlogPost, generateFaqSchema } from "@/lib/ai/blog-generator";

export const maxDuration = 60; // Vercel Hobby plan max

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const generated: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Pick 1 pending keyword (limit to 1 per run for quality + API cost control)
    const { data: keywords } = await supabase
      .from("blog_keywords")
      .select("*")
      .eq("status", "pending")
      .order("priority", { ascending: false })
      .limit(1);

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No unused keywords found",
        generated: 0,
      });
    }

    // 2. Generate blog post for the keyword
    for (const keyword of keywords) {
      try {
        // Mark keyword as generating
        await supabase
          .from("blog_keywords")
          .update({ status: "generating" })
          .eq("id", keyword.id);

        const post = await generateBlogPost({
          primary_keyword: String(keyword.keyword),
          secondary_keywords: (keyword.secondary_keywords as string[]) || [],
          target_audience: String(keyword.target_audience || "홈페이지/앱 제작을 고려하는 사업주"),
          service_category: String(keyword.service_category || "homepage"),
          category: String(keyword.category || "인사이트"),
        });

        // 3. Validate quality
        const validation = validateBlogPost(post);
        if (!validation.valid) {
          console.warn(`Quality check failed for "${keyword.keyword}":`, validation.issues);
        }

        // 4. Generate FAQ schema
        const faqSchema = generateFaqSchema(post.faq);

        // 5. Calculate scheduled publish time (24 hours from now)
        const scheduledFor = new Date();
        scheduledFor.setHours(scheduledFor.getHours() + 24);

        // 6. Save to Supabase
        const { data: insertedPost, error: insertError } = await supabase
          .from("blog_posts")
          .insert({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            category: post.category,
            tags: post.tags,
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            cover_image_url: post.cover_image_url || null,
            faq_schema: faqSchema,
            reading_time_minutes: post.reading_time_minutes,
            status: validation.valid ? "scheduled" : "draft",
            scheduled_for: validation.valid ? scheduledFor.toISOString() : null,
            primary_keyword: post.primary_keyword,
            keyword_density: post.keyword_density,
            quality_score: post.quality_score,
          })
          .select("id")
          .single();

        if (insertError) {
          errors.push(`Insert failed for "${keyword.keyword}": ${insertError.message}`);
          continue;
        }

        // 7. Mark keyword as used and link to the blog post
        await supabase
          .from("blog_keywords")
          .update({
            used: true,
            status: "scheduled",
            blog_post_id: insertedPost?.id || null,
          })
          .eq("id", keyword.id);

        generated.push(post.title);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Generation failed for "${keyword.keyword}": ${message}`);
        // Mark keyword as failed for retry
        await supabase
          .from("blog_keywords")
          .update({ status: "failed" })
          .eq("id", keyword.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generated.length} posts`,
      generated: generated.length,
      titles: generated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error("Blog generation error:", e);
    return NextResponse.json(
      { error: "Blog generation failed", details: e instanceof Error ? e.message : "" },
      { status: 500 }
    );
  }
}
