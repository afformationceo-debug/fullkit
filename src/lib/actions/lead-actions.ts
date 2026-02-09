"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLead(formData: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service_type: string;
  budget_range?: string;
  description?: string;
  source?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name: formData.name,
    phone: formData.phone,
    email: formData.email || null,
    company: formData.company || null,
    service_type: formData.service_type,
    budget_range: formData.budget_range || null,
    description: formData.description || null,
    source: formData.source || "website",
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/leads");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return { success: true };
}

export async function updateLead(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update(data)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return { success: true };
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/leads");
  return { success: true };
}

export async function addLeadNote(leadId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("lead_notes").insert({
    lead_id: leadId,
    content,
    created_by: user?.id,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/leads/${leadId}`);
  return { success: true };
}

export async function convertLeadToClient(leadId: string) {
  const supabase = await createClient();

  // Get lead data
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) return { success: false, error: "리드를 찾을 수 없습니다." };

  // Create client
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({
      company_name: lead.company || lead.name,
      contact_name: lead.name,
      contact_email: lead.email,
      contact_phone: lead.phone,
      lead_id: leadId,
    })
    .select()
    .single();

  if (clientError) return { success: false, error: clientError.message };

  // Update lead status to won
  await supabase.from("leads").update({ status: "won" }).eq("id", leadId);

  revalidatePath("/leads");
  revalidatePath("/clients");
  return { success: true, clientId: client.id };
}
