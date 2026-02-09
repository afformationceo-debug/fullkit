import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FolderKanban,
  Receipt,
  FileText,
} from "lucide-react";
import { InvoiceStatusActions } from "./invoice-status-actions";

const statusLabels: Record<string, string> = {
  draft: "초안",
  sent: "발송",
  paid: "결제완료",
  overdue: "연체",
  cancelled: "취소",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500",
  sent: "bg-blue-500/10 text-blue-500",
  paid: "bg-green-500/10 text-green-500",
  overdue: "bg-red-500/10 text-red-500",
  cancelled: "bg-yellow-500/10 text-yellow-500",
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
}

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, clients(company_name), projects(title, project_number), invoice_items(*)")
    .eq("id", id)
    .single();

  if (error || !invoice) notFound();

  const client = invoice.clients as { company_name: string } | null;
  const project = invoice.projects as { title: string; project_number: string } | null;
  const items = (invoice.invoice_items as Array<Record<string, unknown>>) || [];

  const sortedItems = items.sort((a, b) => ((a.sort_order as number) || 0) - ((b.sort_order as number) || 0));

  const infoItems = [
    { icon: Building2, label: "거래처", value: client?.company_name || "-" },
    { icon: FolderKanban, label: "프로젝트", value: project ? `${project.title} (${project.project_number})` : "-" },
    { icon: Calendar, label: "발행일", value: formatDate(invoice.issue_date as string | null) },
    { icon: Calendar, label: "만기일", value: formatDate(invoice.due_date as string | null) },
    { icon: Calendar, label: "결제일", value: formatDate(invoice.paid_at as string | null) },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/accounting"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={14} /> 회계 목록
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{invoice.invoice_number as string}</h1>
            <Badge
              variant="secondary"
              className={`${statusColors[(invoice.status as string)] || ""}`}
            >
              {statusLabels[(invoice.status as string)] || (invoice.status as string)}
            </Badge>
          </div>
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

          {/* Line Items */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} />
              <h2 className="font-semibold">청구 항목</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">항목</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">수량</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">단가</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedItems.map((item) => (
                    <tr key={item.id as string}>
                      <td className="py-3">{item.description as string}</td>
                      <td className="py-3 text-right text-muted-foreground">{item.quantity as number}</td>
                      <td className="py-3 text-right text-muted-foreground">{formatCurrency((item.unit_price as number) || 0)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency((item.amount as number) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">소계</span>
                <span>{formatCurrency((invoice.subtotal as number) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">세금 ({invoice.tax_rate as number || 10}%)</span>
                <span>{formatCurrency((invoice.tax_amount as number) || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                <span>합계</span>
                <span>{formatCurrency((invoice.total_amount as number) || 0)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(invoice.notes as string) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-3">비고</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {invoice.notes as string}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">상태 관리</h2>
            <InvoiceStatusActions invoiceId={id} currentStatus={invoice.status as string} />
          </div>

          {/* Amount Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">금액 요약</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <Receipt size={14} className="inline mr-1" />
                  총 청구액
                </span>
                <span className="text-lg font-bold">{formatCurrency((invoice.total_amount as number) || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
