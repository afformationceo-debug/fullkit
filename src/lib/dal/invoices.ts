import { createClient } from "@/lib/supabase/server";

export async function getInvoices(filters?: {
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
    .from("invoices")
    .select("*, clients(company_name), projects(title)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) {
    query = query.or(`invoice_number.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*), clients(company_name, contact_name, contact_email), projects(title)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getInvoiceStats() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("invoices").select("status, total_amount");
  if (error) throw error;

  return {
    total: data?.length || 0,
    totalAmount: data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
    paid: data?.filter(i => i.status === "paid").length || 0,
    paidAmount: data?.filter(i => i.status === "paid").reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
    overdue: data?.filter(i => i.status === "overdue").length || 0,
    draft: data?.filter(i => i.status === "draft").length || 0,
  };
}
