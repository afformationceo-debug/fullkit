import { createClient } from "@/lib/supabase/server";

export async function getDeliverables(filters?: {
  projectId?: string;
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
    .from("deliverables")
    .select("*, projects(title), attachments(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.projectId) query = query.eq("project_id", filters.projectId);
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}
