import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/admin/search-input";

export const metadata = { title: "프로젝트 관리 | Full Kit Admin" };

const statusLabels: Record<string, string> = {
  planning: "기획",
  designing: "디자인",
  developing: "개발",
  testing: "테스트",
  launched: "런칭",
  completed: "완료",
  on_hold: "보류",
  cancelled: "취소",
};

const statusColors: Record<string, string> = {
  planning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  designing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  developing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  testing: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  launched: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  on_hold: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const serviceLabels: Record<string, string> = {
  homepage: "홈페이지",
  app: "앱",
  solution: "솔루션",
  automation: "자동화",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const filterStatus = params.status || "";
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const perPage = 20;

  const supabase = await createClient();
  let projects: Array<Record<string, unknown>> = [];
  let count = 0;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  try {
    let query = supabase
      .from("projects")
      .select("*, clients(company_name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filterStatus) {
      query = query.eq("status", filterStatus);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,project_number.ilike.%${search}%`);
    }

    const { data, count: totalCount } = await query;
    projects = data || [];
    count = totalCount || 0;
  } catch {}

  const totalPages = Math.ceil(count / perPage);

  const allStatuses = Object.keys(statusLabels);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">프로젝트 관리</h1>
          <p className="text-muted-foreground mt-1">진행 중인 프로젝트와 마일스톤을 관리합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/projects/new"><Plus size={16} className="mr-1" /> 프로젝트 추가</Link>
        </Button>
      </div>

      {/* Search + Status filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput placeholder="프로젝트 검색..." defaultValue={search} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/projects">
          <Badge
            variant={!filterStatus ? "default" : "outline"}
            className="cursor-pointer text-xs px-3 py-1"
          >
            전체
          </Badge>
        </Link>
        {allStatuses.map((s) => (
          <Link key={s} href={`/projects?status=${s}`}>
            <Badge
              variant={filterStatus === s ? "default" : "outline"}
              className={`cursor-pointer text-xs px-3 py-1 ${filterStatus === s ? statusColors[s] || "" : ""}`}
            >
              {statusLabels[s]}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderKanban size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              {filterStatus ? "해당 상태의 프로젝트가 없습니다." : "아직 등록된 프로젝트가 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {filterStatus ? "다른 필터를 선택해 보세요." : "리드를 수주하면 프로젝트가 생성됩니다."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">번호</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">프로젝트명</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">거래처</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">서비스</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">시작일</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">종료일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.map((project) => {
                    const client = project.clients as { company_name: string } | null;
                    return (
                      <tr key={project.id as string} className="hover:bg-accent/30 transition-colors">
                        <td className="p-4">
                          <Link href={`/projects/${project.id}`} className="text-xs font-mono text-brand hover:underline">
                            {project.project_number as string}
                          </Link>
                        </td>
                        <td className="p-4 font-medium">
                          <Link href={`/projects/${project.id}`} className="hover:underline">
                            {project.title as string}
                          </Link>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {client?.company_name || "-"}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {serviceLabels[(project.service_type as string)] || (project.service_type as string)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${statusColors[(project.status as string)] || ""}`}
                          >
                            {statusLabels[(project.status as string)] || (project.status as string)}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(project.start_date as string | null)}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(project.end_date as string | null)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <span className="text-xs text-muted-foreground">총 {count}건 중 {from + 1}-{Math.min(to + 1, count)}건</span>
                <div className="flex items-center gap-1">
                  {page > 1 && (
                    <Link href={`/projects?page=${page - 1}${filterStatus ? `&status=${filterStatus}` : ""}${search ? `&search=${search}` : ""}`}>
                      <Button variant="ghost" size="sm"><ChevronLeft size={14} /></Button>
                    </Link>
                  )}
                  <span className="text-sm px-2">{page} / {totalPages}</span>
                  {page < totalPages && (
                    <Link href={`/projects?page=${page + 1}${filterStatus ? `&status=${filterStatus}` : ""}${search ? `&search=${search}` : ""}`}>
                      <Button variant="ghost" size="sm"><ChevronRight size={14} /></Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
