import { createClient } from "@/lib/supabase/server";

export async function getMeetings(filters?: {
  search?: string;
  upcoming?: boolean;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const perPage = filters?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("meetings")
    .select("*, leads(name, company), clients(company_name)", { count: "exact" })
    .order("meeting_date", { ascending: true })
    .range(from, to);

  if (filters?.upcoming) {
    query = query.gte("meeting_date", new Date().toISOString());
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getMeetingById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meetings")
    .select("*, leads(name, company), clients(company_name), follow_ups(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
