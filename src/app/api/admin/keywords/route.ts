import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      keyword,
      secondary_keywords,
      service_category,
      category,
      target_audience,
      priority,
    } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "keyword is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("blog_keywords").insert({
      keyword,
      secondary_keywords: secondary_keywords || [],
      service_category: service_category || "homepage",
      category: category || "인사이트",
      target_audience: target_audience || "홈페이지/앱 제작을 고려하는 사업주",
      priority: priority || 5,
      used: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to add keyword" },
      { status: 500 }
    );
  }
}
