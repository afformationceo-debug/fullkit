"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTicket(formData: {
  contract_id: string;
  title: string;
  description?: string;
  priority?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("tickets").insert(formData);

  if (error) return { success: false, error: error.message };
  revalidatePath("/maintenance");
  return { success: true };
}

export async function updateTicketStatus(id: string, status: string) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status };
  if (status === "resolved" || status === "closed") {
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase.from("tickets").update(updateData).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/maintenance");
  return { success: true };
}

export async function deleteTicket(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/maintenance");
  return { success: true };
}

export async function deleteContract(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("maintenance_contracts").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/maintenance");
  return { success: true };
}

export async function addTicketComment(ticketId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("ticket_comments").insert({
    ticket_id: ticketId,
    content,
    created_by: user?.id,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/maintenance/tickets/${ticketId}`);
  return { success: true };
}
