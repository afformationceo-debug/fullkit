import { createClient } from "@/lib/supabase/server";

export async function getFeedback(filters?: {
  status?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const perPage = filters?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("feedback")
    .select("*, projects(title), clients(company_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.status) query = query.eq("status", filters.status);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getFeedbackById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("*, projects(title), clients(company_name), feedback_comments(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
