import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyFormSchema } from "@/lib/validators/apply";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applyFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      service_type: parsed.data.service_type,
      budget_range: parsed.data.budget_range || null,
      description: parsed.data.description,
      source: "website",
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json(
        { error: "접수 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Apply API error:", e);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
