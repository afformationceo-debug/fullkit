import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Plus } from "lucide-react";

export const metadata = { title: "회계 관리 | Full Kit Admin" };

const statusLabels: Record<string, string> = {
  draft: "초안",
  sent: "발송",
  paid: "결제완료",
  overdue: "연체",
  cancelled: "취소",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  sent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  paid: "bg-green-500/10 text-green-500 border-green-500/20",
  overdue: "bg-red-500/10 text-red-500 border-red-500/20",
  cancelled: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
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

export default async function AccountingPage() {
  const supabase = await createClient();
  let invoices: Array<Record<string, unknown>> = [];

  try {
    const { data } = await supabase
      .from("invoices")
      .select("*, clients(company_name), projects(title)")
      .order("created_at", { ascending: false });
    invoices = data || [];
  } catch {}

  // Calculate summary stats
  const totalAmount = invoices.reduce((sum, inv) => sum + ((inv.total_amount as number) || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + ((inv.total_amount as number) || 0), 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + ((inv.total_amount as number) || 0), 0);
  const pendingAmount = totalAmount - paidAmount - overdueAmount;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">회계 관리</h1>
          <p className="text-muted-foreground mt-1">청구서와 결제 내역을 관리합니다.</p>
        </div>
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Link href="/accounting/new"><Plus size={16} className="mr-1" /> 청구서 추가</Link>
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "총 청구액", value: formatCurrency(totalAmount), color: "text-foreground" },
          { label: "결제완료", value: formatCurrency(paidAmount), color: "text-green-500" },
          { label: "미결제", value: formatCurrency(pendingAmount), color: "text-blue-500" },
          { label: "연체", value: formatCurrency(overdueAmount), color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">아직 등록된 청구서가 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-1">프로젝트 진행 시 청구서를 발행하세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">청구번호</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">거래처</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">프로젝트</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">금액</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">만기일</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">결제일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => {
                  const client = invoice.clients as { company_name: string } | null;
                  const project = invoice.projects as { title: string } | null;
                  return (
                    <tr key={invoice.id as string} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4">
                        <Link href={`/accounting/${invoice.id}`} className="text-xs font-mono text-brand hover:underline">
                          {invoice.invoice_number as string}
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {client?.company_name || "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {project?.title || "-"}
                      </td>
                      <td className="p-4 text-right font-medium whitespace-nowrap">
                        {formatCurrency((invoice.total_amount as number) || 0)}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusColors[(invoice.status as string)] || ""}`}
                        >
                          {statusLabels[(invoice.status as string)] || (invoice.status as string)}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(invoice.due_date as string | null)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(invoice.paid_at as string | null)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
