import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FolderKanban,
  ListChecks,
  Milestone,
  Tag,
} from "lucide-react";
import { ProjectStatusActions } from "./project-status-actions";

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
  planning: "bg-blue-500/10 text-blue-500",
  designing: "bg-purple-500/10 text-purple-500",
  developing: "bg-yellow-500/10 text-yellow-500",
  testing: "bg-orange-500/10 text-orange-500",
  launched: "bg-green-500/10 text-green-500",
  completed: "bg-emerald-500/10 text-emerald-500",
  on_hold: "bg-gray-500/10 text-gray-500",
  cancelled: "bg-red-500/10 text-red-500",
};

const serviceLabels: Record<string, string> = {
  homepage: "홈페이지",
  app: "앱",
  solution: "솔루션",
  automation: "자동화",
};

const taskStatusLabels: Record<string, string> = {
  todo: "대기",
  in_progress: "진행중",
  review: "검토",
  done: "완료",
};

const taskStatusColors: Record<string, string> = {
  todo: "bg-gray-500/10 text-gray-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  review: "bg-yellow-500/10 text-yellow-500",
  done: "bg-green-500/10 text-green-500",
};

const taskPriorityColors: Record<string, string> = {
  low: "text-gray-500",
  medium: "text-blue-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
}

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, clients(company_name, contact_name), tasks(*), milestones(*), requirements(*)")
    .eq("id", id)
    .single();

  if (error || !project) notFound();

  const client = project.clients as { company_name: string; contact_name: string } | null;
  const tasks = (project.tasks as Array<Record<string, unknown>>) || [];
  const milestones = (project.milestones as Array<Record<string, unknown>>) || [];
  const requirements = (project.requirements as Array<Record<string, unknown>>) || [];

  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const infoItems = [
    { icon: Building2, label: "거래처", value: client?.company_name || "-" },
    { icon: Tag, label: "서비스 유형", value: serviceLabels[project.service_type as string] || (project.service_type as string) },
    { icon: DollarSign, label: "예산", value: project.budget ? formatCurrency(project.budget as number) : "-" },
    { icon: Calendar, label: "시작일", value: formatDate(project.start_date as string | null) },
    { icon: Calendar, label: "종료일", value: formatDate(project.end_date as string | null) },
    { icon: Calendar, label: "등록일", value: formatDate(project.created_at as string) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 프로젝트 목록
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title as string}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[(project.status as string)] || ""}`}
            >
              {statusLabels[(project.status as string)] || (project.status as string)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{project.project_number as string}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {(project.description as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">프로젝트 설명</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {project.description as string}
              </p>
            </div>
          )}

          {/* Tasks */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks size={16} />
              <h2 className="font-semibold">태스크</h2>
              <span className="text-xs text-muted-foreground">
                ({completedTasks}/{tasks.length})
              </span>
            </div>
            {tasks.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">등록된 태스크가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {tasks
                  .sort((a, b) => new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime())
                  .map((task) => (
                    <div
                      key={task.id as string}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${taskPriorityColors[(task.priority as string)] || "text-gray-500"} bg-current`} />
                        <div>
                          <p className={`text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "font-medium"}`}>
                            {task.title as string}
                          </p>
                          {(task.due_date as string) && (
                            <p className="text-xs text-muted-foreground">{formatDate(task.due_date as string)}</p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${taskStatusColors[(task.status as string)] || ""}`}
                      >
                        {taskStatusLabels[(task.status as string)] || (task.status as string)}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Milestone size={16} />
                <h2 className="font-semibold">마일스톤</h2>
              </div>
              <div className="space-y-2">
                {milestones
                  .sort((a, b) => new Date(a.due_date as string).getTime() - new Date(b.due_date as string).getTime())
                  .map((ms) => (
                    <div key={ms.id as string} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium">{ms.title as string}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(ms.due_date as string)}</p>
                      </div>
                      <Badge variant={ms.status === "completed" ? "default" : "outline"} className="text-xs">
                        {ms.status === "completed" ? "완료" : ms.status === "in_progress" ? "진행중" : "대기"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <FolderKanban size={16} />
                <h2 className="font-semibold">요구사항</h2>
              </div>
              <div className="space-y-2">
                {requirements.map((req) => (
                  <div key={req.id as string} className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium">{req.title as string}</p>
                    {(req.description as string) && (
                      <p className="text-xs text-muted-foreground mt-1">{req.description as string}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">상태 관리</h2>
            <ProjectStatusActions projectId={id} currentStatus={project.status as string} />
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">진행률</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>태스크 완료율</span>
                  <span>{tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all"
                    style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
