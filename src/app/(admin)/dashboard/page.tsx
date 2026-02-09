import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Users,
  FolderKanban,
  Receipt,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "대시보드 | Full Kit Admin",
};

const statusLabels: Record<string, string> = {
  new: "신규",
  contacted: "연락완료",
  meeting_scheduled: "미팅예정",
  proposal_sent: "견적발송",
  negotiating: "협상중",
  won: "수주",
  lost: "실패",
  planning: "기획",
  designing: "디자인",
  developing: "개발",
  testing: "테스트",
  launched: "런칭",
  completed: "완료",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-yellow-500/10 text-yellow-500",
  meeting_scheduled: "bg-purple-500/10 text-purple-500",
  proposal_sent: "bg-orange-500/10 text-orange-500",
  negotiating: "bg-cyan-500/10 text-cyan-500",
  won: "bg-green-500/10 text-green-500",
  lost: "bg-red-500/10 text-red-500",
  planning: "bg-blue-500/10 text-blue-500",
  designing: "bg-purple-500/10 text-purple-500",
  developing: "bg-yellow-500/10 text-yellow-500",
  testing: "bg-orange-500/10 text-orange-500",
  launched: "bg-green-500/10 text-green-500",
  completed: "bg-emerald-500/10 text-emerald-500",
};

async function getDashboardData() {
  const supabase = await createClient();

  const [leadsRes, projectsRes, invoicesRes, ticketsRes, recentLeadsRes, recentProjectsRes] =
    await Promise.all([
      supabase.from("leads").select("status"),
      supabase.from("projects").select("status"),
      supabase.from("invoices").select("status, total_amount"),
      supabase.from("tickets").select("status", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("id, lead_number, name, company, service_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("projects")
        .select("id, project_number, title, status, clients(company_name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const leads = leadsRes.data || [];
  const projects = projectsRes.data || [];
  const invoices = invoicesRes.data || [];

  return {
    stats: {
      leads: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      projects: projects.length,
      activeProjects: projects.filter((p) =>
        ["planning", "designing", "developing", "testing"].includes(p.status)
      ).length,
      totalRevenue: invoices
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + (i.total_amount || 0), 0),
      overdueInvoices: invoices.filter((i) => i.status === "overdue").length,
      tickets: ticketsRes.count ?? 0,
    },
    recentLeads: recentLeadsRes.data || [],
    recentProjects: recentProjectsRes.data || [],
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

const serviceLabels: Record<string, string> = {
  homepage: "홈페이지",
  app: "앱",
  solution: "솔루션",
  automation: "자동화",
};

export default async function DashboardPage() {
  let data = {
    stats: { leads: 0, newLeads: 0, projects: 0, activeProjects: 0, totalRevenue: 0, overdueInvoices: 0, tickets: 0 },
    recentLeads: [] as Array<Record<string, unknown>>,
    recentProjects: [] as Array<Record<string, unknown>>,
  };

  try {
    data = await getDashboardData();
  } catch {
    // Supabase query error - show defaults
  }

  const statCards = [
    {
      label: "총 리드",
      value: data.stats.leads,
      sub: `신규 ${data.stats.newLeads}건`,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/leads",
    },
    {
      label: "프로젝트",
      value: data.stats.projects,
      sub: `진행중 ${data.stats.activeProjects}건`,
      icon: FolderKanban,
      color: "text-green-500",
      bg: "bg-green-500/10",
      href: "/projects",
    },
    {
      label: "매출",
      value: formatCurrency(data.stats.totalRevenue),
      sub: data.stats.overdueInvoices > 0 ? `미수금 ${data.stats.overdueInvoices}건` : "미수금 없음",
      icon: Receipt,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      href: "/accounting",
      isText: true,
    },
    {
      label: "지원 티켓",
      value: data.stats.tickets,
      sub: "전체 티켓",
      icon: MessageSquare,
      color: "text-red-500",
      bg: "bg-red-500/10",
      href: "/maintenance",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-1">전체 현황을 한 눈에 확인하세요.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-card p-6 hover:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <p className={`font-bold ${card.isText ? "text-xl" : "text-3xl"}`}>{card.value}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{card.sub}</span>
              <ArrowRight
                size={14}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              <h2 className="font-semibold">최근 리드</h2>
            </div>
            <Link
              href="/leads"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              전체 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentLeads.length === 0 ? (
              <div className="p-8 text-center">
                <TrendingUp size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  아직 접수된 리드가 없습니다.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  신청폼에서 접수되면 여기에 표시됩니다.
                </p>
              </div>
            ) : (
              data.recentLeads.map((lead) => (
                <Link
                  key={String(lead.id)}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {String(lead.lead_number)}
                      </span>
                      <span className="font-medium truncate">{String(lead.name)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {String(lead.company || "") && (
                        <span className="text-xs text-muted-foreground">{String(lead.company)}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {serviceLabels[String(lead.service_type)] || String(lead.service_type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColors[String(lead.status)] || ""}`}
                    >
                      {statusLabels[String(lead.status)] || String(lead.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(String(lead.created_at))}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <FolderKanban size={18} className="text-green-500" />
              <h2 className="font-semibold">최근 프로젝트</h2>
            </div>
            <Link
              href="/projects"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              전체 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentProjects.length === 0 ? (
              <div className="p-8 text-center">
                <FolderKanban size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  아직 등록된 프로젝트가 없습니다.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  리드를 수주하면 프로젝트가 생성됩니다.
                </p>
              </div>
            ) : (
              data.recentProjects.map((project) => (
                <Link
                  key={String(project.id)}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {String(project.project_number)}
                      </span>
                      <span className="font-medium truncate">{String(project.title)}</span>
                    </div>
                    {String((project.clients as Record<string, unknown>)?.company_name || "") && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {String((project.clients as Record<string, unknown>)?.company_name || "")}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs flex-shrink-0 ${statusColors[String(project.status)] || ""}`}
                  >
                    {statusLabels[String(project.status)] || String(project.status)}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
