"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateDeliverable(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("deliverables").update(data).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/deliverables");
  revalidatePath(`/deliverables/${id}`);
  return { success: true };
}

export async function deleteDeliverable(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("deliverables").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/deliverables");
  return { success: true };
}
