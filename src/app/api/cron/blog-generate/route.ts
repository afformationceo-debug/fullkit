import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateBlogPost, validateBlogPost, generateFaqSchema } from "@/lib/ai/blog-generator";

export const maxDuration = 60; // Allow up to 60s for AI generation

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const generated: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Pick unused keywords from blog_keywords table (limit 3 per run)
    const { data: keywords } = await supabase
      .from("blog_keywords")
      .select("*")
      .eq("used", false)
      .order("priority", { ascending: false })
      .limit(3);

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No unused keywords found",
        generated: 0,
      });
    }

    // 2. Generate blog posts for each keyword
    for (const keyword of keywords) {
      try {
        const post = await generateBlogPost({
          primary_keyword: keyword.keyword,
          secondary_keywords: keyword.secondary_keywords || [],
          target_audience: keyword.target_audience || "홈페이지/앱 제작을 고려하는 사업주",
          service_category: keyword.service_category || "homepage",
          category: keyword.category || "인사이트",
        });

        // 3. Validate quality
        const validation = validateBlogPost(post);
        if (!validation.valid) {
          console.warn(`Quality check failed for "${keyword.keyword}":`, validation.issues);
          // Still save but mark as draft for review
        }

        // 4. Generate FAQ schema
        const faqSchema = generateFaqSchema(post.faq);

        // 5. Calculate scheduled publish time (stagger 8 hours apart)
        const scheduledFor = new Date();
        scheduledFor.setHours(scheduledFor.getHours() + generated.length * 8 + 24);

        // 6. Save to Supabase
        const { error: insertError } = await supabase.from("blog_posts").insert({
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
          keyword_density: null,
          quality_score: validation.valid ? 80 : 50,
        });

        if (insertError) {
          errors.push(`Insert failed for "${keyword.keyword}": ${insertError.message}`);
          continue;
        }

        // 7. Mark keyword as used
        await supabase
          .from("blog_keywords")
          .update({ used: true })
          .eq("id", keyword.id);

        generated.push(post.title);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Generation failed for "${keyword.keyword}": ${message}`);
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
