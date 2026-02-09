import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [leadsRes, projectsRes, invoicesRes, ticketsRes] = await Promise.all([
    supabase.from("leads").select("status", { count: "exact" }),
    supabase.from("projects").select("status", { count: "exact" }),
    supabase.from("invoices").select("status, total_amount"),
    supabase.from("tickets").select("status", { count: "exact" }),
  ]);

  const leads = leadsRes.data || [];
  const projects = projectsRes.data || [];
  const invoices = invoicesRes.data || [];
  const tickets = ticketsRes.data || [];

  return {
    leads: {
      total: leads.length,
      new: leads.filter(l => l.status === "new").length,
      thisMonth: leads.length, // simplified - would filter by date in production
    },
    projects: {
      total: projects.length,
      active: projects.filter(p => ["planning", "designing", "developing", "testing"].includes(p.status)).length,
      completed: projects.filter(p => p.status === "completed").length,
    },
    invoices: {
      total: invoices.length,
      totalAmount: invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0),
      paidAmount: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0),
      overdueCount: invoices.filter(i => i.status === "overdue").length,
    },
    tickets: {
      total: tickets.length,
      open: tickets.filter(t => t.status === "open").length,
      inProgress: tickets.filter(t => t.status === "in_progress").length,
    },
  };
}

export async function getRecentLeads(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, lead_number, name, company, service_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getRecentProjects(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, project_number, title, status, clients(company_name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
