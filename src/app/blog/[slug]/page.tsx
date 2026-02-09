import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { ShareButton } from "@/components/blog/ShareButton";

// Placeholder - will be replaced by Supabase fetch
const posts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  faq: Array<{ question: string; answer: string }>;
}> = {
  "homepage-cost-guide-2026": {
    title: "2026 홈페이지 제작 비용 총정리 – 업종별·유형별 견적 가이드",
    excerpt: "홈페이지 제작 비용이 궁금하신가요? 업종별, 유형별 실제 견적 데이터를 바탕으로 합리적인 예산을 잡는 방법을 알려드립니다.",
    category: "홈페이지",
    readingTime: 7,
    publishedAt: "2026-01-15",
    metaTitle: "2026 홈페이지 제작 비용 총정리 | Full Kit",
    metaDescription: "홈페이지 제작 비용, 업종별 견적, 유형별 가격 비교. 투명한 가격으로 합리적인 예산을 잡는 방법을 알려드립니다.",
    content: `<h2>홈페이지 제작 비용, 왜 천차만별일까?</h2>
<p>홈페이지 제작 비용은 수십만 원부터 수천만 원까지 다양합니다. 이는 제작 방식, 기능 범위, 디자인 수준에 따라 크게 달라지기 때문입니다. 이 글에서는 2026년 기준 실제 견적 데이터를 바탕으로 합리적인 예산을 잡는 방법을 알려드립니다.</p>

<h2>유형별 홈페이지 제작 비용</h2>
<h3>템플릿 기반 (50~200만원)</h3>
<p>아임웹, 워드프레스 템플릿을 활용한 방식입니다. 빠르게 만들 수 있지만, 디자인과 기능에 한계가 있습니다.</p>

<h3>세미커스텀 (200~500만원)</h3>
<p>템플릿을 기반으로 브랜드에 맞게 수정하는 방식입니다. 합리적인 가격에 어느 정도 차별화가 가능합니다.</p>

<h3>풀커스텀 (500~2,000만원+)</h3>
<p>처음부터 설계하고 개발하는 방식입니다. 완전한 디자인 자유도와 맞춤 기능이 가능하며, Full Kit이 추구하는 방식입니다.</p>

<h2>업종별 평균 견적</h2>
<p>병원/의료: 300~800만원, 기업 소개: 200~500만원, 쇼핑몰: 500~2,000만원, 포트폴리오: 150~400만원</p>

<h2>비용을 결정하는 핵심 요소</h2>
<p>페이지 수, 반응형 여부, 관리자 기능, SEO 최적화, 유지보수 범위 등이 비용을 결정합니다.</p>`,
    faq: [
      { question: "홈페이지 제작 비용은 평균 얼마인가요?", answer: "유형에 따라 50만원~2,000만원 이상까지 다양합니다. 세미커스텀 기준 200~500만원이 가장 일반적입니다. Full Kit은 프로젝트 규모에 맞는 투명한 견적을 제공합니다." },
      { question: "홈페이지 제작 기간은 얼마나 걸리나요?", answer: "템플릿 기반은 1~2주, 커스텀은 4~8주가 일반적입니다. Full Kit은 프로젝트 범위에 따라 정확한 일정을 안내합니다." },
      { question: "유지보수 비용은 별도인가요?", answer: "Full Kit은 1년 무상 유지보수를 기본 제공합니다. 이후에는 월 유지보수 계약으로 안정적인 관리가 가능합니다." },
      { question: "워드프레스와 맞춤 개발, 뭐가 좋나요?", answer: "간단한 소개 사이트는 워드프레스도 좋지만, 확장성과 퍼포먼스가 중요하다면 맞춤 개발을 추천합니다." },
      { question: "추가 비용이 발생하는 경우가 있나요?", answer: "Full Kit은 견적 확정 후 추가 비용이 발생하지 않습니다. 범위 변경 시에만 사전 협의 후 조정합니다." },
    ],
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "글을 찾을 수 없습니다" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fullkit.kr";

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fullkit.kr";
  const sanitizedContent = sanitizeHtml(post.content);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Full Kit",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Full Kit",
      url: baseUrl,
    },
  };

  const faqJsonLd = post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={14} /> 블로그로 돌아가기
          </Link>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand font-medium">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {post.readingTime}분 읽기
              </span>
              <span className="text-xs text-muted-foreground">
                {post.publishedAt}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          </header>

          {/* Cover Image placeholder */}
          <div className="aspect-[16/9] bg-muted rounded-2xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
          </div>

          {/* Article Content - sanitized via DOMPurify */}
          <div
            className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-brand prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Mid-article CTA */}
          <div className="my-10 rounded-xl border border-border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              전문가 상담이 필요하시다면,{" "}
              <Link href="/apply" className="text-brand font-medium hover:underline">
                Full Kit 무료 상담
              </Link>
              을 이용해 보세요.
            </p>
          </div>

          {/* FAQ Section */}
          {post.faq.length > 0 && (
            <section className="mt-12 border-t border-border pt-10">
              <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
              <div className="space-y-6">
                {post.faq.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-2">Q. {item.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl border border-brand/20 bg-brand/5 p-8 text-center">
            <h3 className="text-xl font-bold mb-2">전문가 상담이 필요하신가요?</h3>
            <p className="text-muted-foreground mb-6">
              Full Kit이 무료로 상담해 드립니다. 부담 없이 문의해 주세요.
            </p>
            <Button asChild>
              <Link href="/apply">무료 상담 신청하기</Link>
            </Button>
          </div>

          {/* Share buttons */}
          <div className="mt-10 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">공유하기:</span>
            <ShareButton url={`${baseUrl}/blog/${slug}`} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
