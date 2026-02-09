"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateFeedbackStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("feedback").update({ status }).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/feedback");
  return { success: true };
}

export async function addFeedbackComment(feedbackId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("feedback_comments").insert({
    feedback_id: feedbackId,
    content,
    created_by: user?.id,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/feedback/${feedbackId}`);
  return { success: true };
}
