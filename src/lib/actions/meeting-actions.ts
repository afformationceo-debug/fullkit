"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMeeting(formData: {
  title: string;
  meeting_date: string;
  location?: string;
  lead_id?: string;
  client_id?: string;
  notes?: string;
  agenda?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("meetings").insert({
    ...formData,
    created_by: user?.id,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/meetings");
  return { success: true };
}

export async function updateMeeting(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("meetings").update(data).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/meetings");
  return { success: true };
}

export async function deleteMeeting(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("meetings").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/meetings");
  return { success: true };
}

export async function addFollowUp(meetingId: string, content: string, dueDate?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("follow_ups").insert({
    meeting_id: meetingId,
    content,
    due_date: dueDate || null,
    assigned_to: user?.id,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/meetings/${meetingId}`);
  return { success: true };
}
