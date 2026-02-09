import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateBlogPost, validateBlogPost } from "@/lib/ai/blog-generator";

export const maxDuration = 60;

export async function POST(request: Request) {
  // Require authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { primary_keyword, secondary_keywords, category, target_audience, service_category } =
      body;

    if (!primary_keyword) {
      return NextResponse.json(
        { error: "primary_keyword is required" },
        { status: 400 }
      );
    }

    const post = await generateBlogPost({
      primary_keyword,
      secondary_keywords: secondary_keywords || [],
      target_audience: target_audience || "홈페이지/앱 제작을 고려하는 사업주",
      service_category: service_category || "homepage",
      category: category || "인사이트",
    });

    const validation = validateBlogPost(post);

    return NextResponse.json({
      ...post,
      validation,
    });
  } catch (e) {
    console.error("Blog generation error:", e);
    return NextResponse.json(
      {
        error: "Blog generation failed",
        details: e instanceof Error ? e.message : "",
      },
      { status: 500 }
    );
  }
}
