import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "블로그 | 홈페이지 제작, 앱 개발, SEO 인사이트",
  description:
    "홈페이지 제작, 앱 개발, 솔루션, 자동화에 대한 유용한 정보와 인사이트를 공유합니다. Full Kit 블로그.",
};

const categories = ["전체", "홈페이지", "앱", "솔루션", "자동화", "인사이트"];

// Placeholder data - will be replaced by Supabase fetch
const placeholderPosts = [
  {
    slug: "homepage-cost-guide-2026",
    title: "2026 홈페이지 제작 비용 총정리 – 업종별·유형별 견적 가이드",
    excerpt:
      "홈페이지 제작 비용이 궁금하신가요? 업종별, 유형별 실제 견적 데이터를 바탕으로 합리적인 예산을 잡는 방법을 알려드립니다.",
    category: "홈페이지",
    readingTime: 7,
    publishedAt: "2026-01-15",
  },
  {
    slug: "app-development-process",
    title: "앱 개발, 어디서부터 시작해야 할까? 초보자를 위한 완벽 가이드",
    excerpt:
      "앱 개발을 처음 의뢰하시는 분들을 위해, 기획부터 출시까지 전 과정을 단계별로 설명합니다.",
    category: "앱",
    readingTime: 5,
    publishedAt: "2026-01-20",
  },
  {
    slug: "seo-ranking-tips",
    title: "구글 상위노출 비법 – 홈페이지 SEO 최적화 7가지 핵심 전략",
    excerpt:
      "홈페이지를 만들었는데 검색에 안 나온다면? 구글과 네이버에서 상위노출되기 위한 SEO 핵심 전략을 공유합니다.",
    category: "인사이트",
    readingTime: 6,
    publishedAt: "2026-01-25",
  },
  {
    slug: "hospital-homepage-guide",
    title: "병원 홈페이지 제작 가이드 – 환자가 신뢰하는 사이트 만들기",
    excerpt:
      "병원 홈페이지는 단순한 소개 페이지가 아닙니다. 환자의 신뢰를 얻고 예약 전환율을 높이는 핵심 전략을 공유합니다.",
    category: "홈페이지",
    readingTime: 8,
    publishedAt: "2026-02-01",
  },
  {
    slug: "automation-for-small-business",
    title: "중소기업 업무 자동화 – 당장 도입할 수 있는 5가지 방법",
    excerpt:
      "반복 업무에 시간을 뺏기고 계신가요? 비용 부담 없이 바로 적용 가능한 업무 자동화 방법을 알려드립니다.",
    category: "자동화",
    readingTime: 5,
    publishedAt: "2026-02-05",
  },
  {
    slug: "startup-mvp-development",
    title: "스타트업 MVP 개발 – 빠르게 검증하고, 효율적으로 성장하기",
    excerpt:
      "아이디어를 빠르게 검증하고 싶다면? MVP(최소 기능 제품)로 시작하는 스마트한 개발 전략을 소개합니다.",
    category: "솔루션",
    readingTime: 6,
    publishedAt: "2026-02-08",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">블로그</h1>
            <p className="mt-3 text-muted-foreground text-lg">
              홈페이지, 앱, 솔루션, 자동화에 대한 유용한 인사이트
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  cat === "전체"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderPosts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/30 transition-colors"
                >
                  <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.readingTime}분 읽기
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.publishedAt}
                      </span>
                    </div>
                    <h2 className="font-semibold leading-snug group-hover:text-brand transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
