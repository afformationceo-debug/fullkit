import { createClient } from "@/lib/supabase/server";

export async function getClients(filters?: {
  search?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const perPage = filters?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.search) {
    query = query.or(`company_name.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getClientById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, client_contacts(*), client_communications(*), projects(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
