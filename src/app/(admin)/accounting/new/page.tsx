"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createInvoice } from "@/lib/actions/invoice-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    if (field === "description") {
      updated[index].description = value as string;
    } else {
      updated[index][field] = Number(value) || 0;
    }
    setItems(updated);
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("ko-KR").format(amount);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const validItems = items.filter((item) => item.description && item.unit_price > 0);

    if (validItems.length === 0) {
      setError("최소 1개의 항목을 입력해 주세요.");
      setLoading(false);
      return;
    }

    const result = await createInvoice({
      client_id: formData.get("client_id") as string,
      project_id: (formData.get("project_id") as string) || undefined,
      due_date: formData.get("due_date") as string,
      items: validItems,
      notes: (formData.get("notes") as string) || undefined,
      tax_rate: 10,
    });

    if (result.success) {
      router.push("/accounting");
    } else {
      setError(result.error || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/accounting"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">청구서 추가</h1>
          <p className="text-muted-foreground text-sm mt-0.5">새 청구서를 발행합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="client_id">거래처 ID *</Label>
            <Input id="client_id" name="client_id" required className="mt-1.5" placeholder="거래처 UUID" />
          </div>
          <div>
            <Label htmlFor="project_id">프로젝트 ID</Label>
            <Input id="project_id" name="project_id" className="mt-1.5" placeholder="프로젝트 UUID (선택)" />
          </div>
          <div>
            <Label htmlFor="due_date">결제 기한 *</Label>
            <Input id="due_date" name="due_date" type="date" required className="mt-1.5" />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>청구 항목</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus size={14} className="mr-1" /> 항목 추가
            </Button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px_120px_32px] gap-2 items-end">
                <div>
                  {index === 0 && <span className="text-xs text-muted-foreground">설명</span>}
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="항목 설명"
                  />
                </div>
                <div>
                  {index === 0 && <span className="text-xs text-muted-foreground">수량</span>}
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  />
                </div>
                <div>
                  {index === 0 && <span className="text-xs text-muted-foreground">단가</span>}
                  <Input
                    type="number"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="h-9 w-9 p-0"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm text-right">
            <p>소계: <span className="font-medium">{formatCurrency(subtotal)}원</span></p>
            <p>부가세 (10%): <span className="font-medium">{formatCurrency(tax)}원</span></p>
            <p className="text-base font-bold">합계: {formatCurrency(total)}원</p>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">비고</Label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder="청구서 비고사항"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> 저장 중...</> : "청구서 발행"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/accounting")}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
