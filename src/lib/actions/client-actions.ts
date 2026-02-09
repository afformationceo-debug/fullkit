"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClient_(formData: {
  company_name: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert(formData);

  if (error) return { success: false, error: error.message };
  revalidatePath("/clients");
  return { success: true };
}

export async function updateClient_(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").update(data).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return { success: true };
}

export async function deleteClient_(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/clients");
  return { success: true };
}

export async function addClientContact(clientId: string, contact: {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("client_contacts").insert({
    client_id: clientId,
    ...contact,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}

export async function addClientCommunication(clientId: string, comm: {
  type: string;
  subject: string;
  content?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("client_communications").insert({
    client_id: clientId,
    ...comm,
    created_by: user?.id,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}
