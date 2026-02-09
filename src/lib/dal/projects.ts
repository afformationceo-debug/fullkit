import { createClient } from "@/lib/supabase/server";

export async function getProjects(filters?: {
  status?: string;
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
    .from("projects")
    .select("*, clients(company_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,project_number.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, clients(company_name, contact_name), milestones(*), tasks(*), requirements(*), project_members(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getProjectTasks(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}
