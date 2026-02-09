import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FolderKanban,
  Users,
  MessageSquare,
  Pencil,
} from "lucide-react";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const serviceLabels: Record<string, string> = {
  homepage: "홈페이지",
  app: "앱",
  solution: "솔루션",
  automation: "자동화",
};

const projectStatusLabels: Record<string, string> = {
  planning: "기획",
  designing: "디자인",
  developing: "개발",
  testing: "테스트",
  launched: "런칭",
  completed: "완료",
  on_hold: "보류",
  cancelled: "취소",
};

const projectStatusColors: Record<string, string> = {
  planning: "bg-blue-500/10 text-blue-500",
  designing: "bg-purple-500/10 text-purple-500",
  developing: "bg-yellow-500/10 text-yellow-500",
  testing: "bg-orange-500/10 text-orange-500",
  launched: "bg-green-500/10 text-green-500",
  completed: "bg-emerald-500/10 text-emerald-500",
  on_hold: "bg-gray-500/10 text-gray-500",
  cancelled: "bg-red-500/10 text-red-500",
};

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("*, client_contacts(*), projects(id, title, status, service_type, project_number), client_communications(id, type, subject, content, created_at)")
    .eq("id", id)
    .single();

  if (error || !client) notFound();

  const contacts = (client.client_contacts as Array<Record<string, unknown>>) || [];
  const projects = (client.projects as Array<Record<string, unknown>>) || [];
  const communications = (client.client_communications as Array<Record<string, unknown>>) || [];

  const infoItems = [
    { icon: Building2, label: "회사명", value: client.company_name as string },
    { icon: Users, label: "담당자", value: client.contact_name as string },
    { icon: Phone, label: "전화번호", value: client.contact_phone as string },
    { icon: Mail, label: "이메일", value: client.contact_email as string },
    { icon: MapPin, label: "주소", value: client.address as string },
    { icon: Calendar, label: "등록일", value: formatDate(client.created_at as string) },
  ].filter((item) => item.value);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/clients"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 거래처 목록
          </Link>
          <h1 className="text-2xl font-bold">{client.company_name as string}</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{client.client_number as string}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/clients/${id}/edit`}><Pencil size={14} className="mr-1.5" /> 수정</Link>
        </Button>
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

          {/* Notes */}
          {(client.notes as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">비고</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {client.notes as string}
              </p>
            </div>
          )}

          {/* Projects */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban size={16} />
              <h2 className="font-semibold">프로젝트</h2>
              <span className="text-xs text-muted-foreground">({projects.length})</span>
            </div>
            {projects.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">등록된 프로젝트가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <Link
                    key={project.id as string}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{project.title as string}</p>
                      <p className="text-xs font-mono text-muted-foreground">{project.project_number as string}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {serviceLabels[(project.service_type as string)] || (project.service_type as string)}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${projectStatusColors[(project.status as string)] || ""}`}
                      >
                        {projectStatusLabels[(project.status as string)] || (project.status as string)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Communications */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} />
              <h2 className="font-semibold">커뮤니케이션 내역</h2>
              <span className="text-xs text-muted-foreground">({communications.length})</span>
            </div>
            {communications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">커뮤니케이션 내역이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {communications
                  .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
                  .map((comm) => (
                    <div key={comm.id as string} className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{comm.type as string}</Badge>
                        <span className="text-sm font-medium">{comm.subject as string}</span>
                      </div>
                      {(comm.content as string) && (
                        <p className="text-xs text-muted-foreground mt-1">{comm.content as string}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(comm.created_at as string)}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Contacts */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} />
              <h2 className="font-semibold">담당자 목록</h2>
            </div>
            {contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">등록된 담당자가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id as string} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{contact.name as string}</p>
                    {(contact.role as string) && (
                      <p className="text-xs text-muted-foreground">{contact.role as string}</p>
                    )}
                    <div className="mt-2 space-y-1">
                      {(contact.email as string) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail size={10} /> {contact.email as string}
                        </div>
                      )}
                      {(contact.phone as string) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone size={10} /> {contact.phone as string}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
