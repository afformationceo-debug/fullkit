import { createClient } from "@/lib/supabase/server";

export async function getMaintenanceContracts(filters?: {
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
    .from("maintenance_contracts")
    .select("*, clients(company_name), projects(title)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.search) {
    query = query.ilike("contract_number", `%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getTickets(filters?: {
  status?: string;
  priority?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const perPage = filters?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("tickets")
    .select("*, maintenance_contracts(contract_number, clients(company_name))", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.priority) query = query.eq("priority", filters.priority);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getTicketById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select("*, maintenance_contracts(contract_number, clients(company_name)), ticket_comments(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
