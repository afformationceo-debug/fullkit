import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateBlogPost, validateBlogPost, generateFaqSchema } from "@/lib/ai/blog-generator";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { keywordId } = await request.json();
    if (!keywordId) {
      return NextResponse.json({ error: "keywordId is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch the keyword
    const { data: keyword, error: fetchError } = await adminClient
      .from("blog_keywords")
      .select("*")
      .eq("id", keywordId)
      .single();

    if (fetchError || !keyword) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    if (keyword.status !== "pending" && keyword.status !== "failed") {
      return NextResponse.json(
        { error: "Keyword is not in pending or failed status" },
        { status: 400 }
      );
    }

    // Mark as generating
    await adminClient
      .from("blog_keywords")
      .update({ status: "generating" })
      .eq("id", keywordId);

    try {
      const post = await generateBlogPost({
        primary_keyword: String(keyword.keyword),
        secondary_keywords: (keyword.secondary_keywords as string[]) || [],
        target_audience: String(keyword.target_audience || "홈페이지/앱 제작을 고려하는 사업주"),
        service_category: String(keyword.service_category || "homepage"),
        category: String(keyword.category || "인사이트"),
      });

      const validation = validateBlogPost(post);
      const faqSchema = generateFaqSchema(post.faq);

      const scheduledFor = new Date();
      scheduledFor.setHours(scheduledFor.getHours() + 24);

      const { data: insertedPost, error: insertError } = await adminClient
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
        await adminClient
          .from("blog_keywords")
          .update({ status: "failed" })
          .eq("id", keywordId);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      await adminClient
        .from("blog_keywords")
        .update({
          used: true,
          status: "scheduled",
          blog_post_id: insertedPost?.id || null,
        })
        .eq("id", keywordId);

      return NextResponse.json({
        success: true,
        title: post.title,
        postId: insertedPost?.id,
      });
    } catch (genErr) {
      await adminClient
        .from("blog_keywords")
        .update({ status: "failed" })
        .eq("id", keywordId);
      throw genErr;
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}
