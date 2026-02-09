"use server";

import { createClient } from "@/lib/supabase/server";
import { applyFormSchema, type ApplyFormValues } from "@/lib/validators/apply";

export async function submitApplyForm(data: ApplyFormValues) {
  const parsed = applyFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "입력 데이터가 올바르지 않습니다." };
  }

  try {
    const supabase = await createClient();

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
      return { success: false, error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
    }

    return { success: true };
  } catch (e) {
    console.error("Apply form error:", e);
    return { success: false, error: "서버 오류가 발생했습니다." };
  }
}
