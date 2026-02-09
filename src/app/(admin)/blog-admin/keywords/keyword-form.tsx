"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

const SERVICE_CATEGORIES = [
  { value: "homepage", label: "홈페이지" },
  { value: "app", label: "앱" },
  { value: "solution", label: "솔루션" },
  { value: "automation", label: "자동화" },
];

export function KeywordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState("");
  const [secondary, setSecondary] = useState("");
  const [serviceCategory, setServiceCategory] = useState("homepage");
  const [category, setCategory] = useState("인사이트");
  const [targetAudience, setTargetAudience] = useState("");
  const [priority, setPriority] = useState("5");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!keyword.trim()) {
      setError("키워드를 입력하세요.");
      return;
    }
    setError("");

    startTransition(async () => {
      const res = await fetch("/api/admin/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim(),
          secondary_keywords: secondary
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          service_category: serviceCategory,
          category,
          target_audience: targetAudience.trim() || undefined,
          priority: parseInt(priority) || 5,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "등록 실패");
        return;
      }

      // Reset form
      setKeyword("");
      setSecondary("");
      setTargetAudience("");
      setPriority("5");
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            메인 키워드 *
          </label>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 홈페이지 제작 비용"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            보조 키워드 (쉼표 구분)
          </label>
          <Input
            value={secondary}
            onChange={(e) => setSecondary(e.target.value)}
            placeholder="웹사이트 제작, 반응형 홈페이지"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            서비스 카테고리
          </label>
          <select
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            블로그 카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="홈페이지">홈페이지</option>
            <option value="앱">앱</option>
            <option value="솔루션">솔루션</option>
            <option value="자동화">자동화</option>
            <option value="인사이트">인사이트</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            타겟 독자 (선택)
          </label>
          <Input
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="홈페이지 제작을 고려하는 사업주"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            우선순위 (1-10)
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-brand text-brand-foreground hover:bg-brand/90"
      >
        {isPending ? (
          <Loader2 size={14} className="mr-1 animate-spin" />
        ) : (
          <Plus size={14} className="mr-1" />
        )}
        키워드 등록
      </Button>
    </div>
  );
}
