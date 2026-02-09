"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "", label: "전체" },
  { value: "new", label: "신규" },
  { value: "contacted", label: "연락완료" },
  { value: "meeting_scheduled", label: "미팅예정" },
  { value: "proposal_sent", label: "견적발송" },
  { value: "negotiating", label: "협상중" },
  { value: "won", label: "수주" },
  { value: "lost", label: "실패" },
];

const sourceOptions = [
  { value: "", label: "전체" },
  { value: "website", label: "웹사이트" },
  { value: "referral", label: "추천" },
  { value: "kmong", label: "크몽" },
  { value: "naver", label: "네이버" },
  { value: "google", label: "구글" },
];

export function LeadFilters({
  currentStatus,
  currentSource,
  currentSearch,
}: {
  currentStatus: string;
  currentSource: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  function buildUrl(params: Record<string, string>) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    return `/leads?${searchParams.toString()}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ status: currentStatus, source: currentSource, search }));
  }

  function clearFilters() {
    setSearch("");
    router.push("/leads");
  }

  const hasFilters = currentStatus || currentSource || currentSearch;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 회사, 이메일, 연락처로 검색..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          검색
        </Button>
      </form>

      {/* Status Filter */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() =>
              router.push(buildUrl({ status: opt.value, source: currentSource, search: currentSearch }))
            }
            className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg transition-colors ${
              currentStatus === opt.value
                ? "bg-brand text-brand-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="flex-shrink-0">
          <X size={14} className="mr-1" /> 초기화
        </Button>
      )}
    </div>
  );
}
