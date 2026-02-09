import { createClient } from "@/lib/supabase/server";

export async function getLeads(filters?: {
  status?: string;
  source?: string;
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
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getLeadById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, lead_notes(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getLeadStats() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("status");
  if (error) throw error;

  const stats = {
    total: data?.length || 0,
    new: data?.filter(l => l.status === "new").length || 0,
    contacted: data?.filter(l => l.status === "contacted").length || 0,
    meeting_scheduled: data?.filter(l => l.status === "meeting_scheduled").length || 0,
    proposal_sent: data?.filter(l => l.status === "proposal_sent").length || 0,
    negotiating: data?.filter(l => l.status === "negotiating").length || 0,
    won: data?.filter(l => l.status === "won").length || 0,
    lost: data?.filter(l => l.status === "lost").length || 0,
  };
  return stats;
}
