"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations/variants";

// Placeholder blog posts until Supabase is connected
const placeholderPosts = [
  {
    slug: "homepage-cost-guide-2026",
    title: "2026 홈페이지 제작 비용 총정리 – 업종별·유형별 견적 가이드",
    excerpt:
      "홈페이지 제작 비용이 궁금하신가요? 업종별, 유형별 실제 견적 데이터를 바탕으로 합리적인 예산을 잡는 방법을 알려드립니다.",
    category: "홈페이지",
    readingTime: 7,
  },
  {
    slug: "app-development-process",
    title: "앱 개발, 어디서부터 시작해야 할까? 초보자를 위한 완벽 가이드",
    excerpt:
      "앱 개발을 처음 의뢰하시는 분들을 위해, 기획부터 출시까지 전 과정을 단계별로 설명합니다.",
    category: "앱",
    readingTime: 5,
  },
  {
    slug: "seo-ranking-tips",
    title: "구글 상위노출 비법 – 홈페이지 SEO 최적화 7가지 핵심 전략",
    excerpt:
      "홈페이지를 만들었는데 검색에 안 나온다면? 구글과 네이버에서 상위노출되기 위한 SEO 핵심 전략을 공유합니다.",
    category: "인사이트",
    readingTime: 6,
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <motion.p
              variants={fadeInUp}
              className="text-sm text-muted-foreground mb-3"
            >
              WhyKit 인사이트
            </motion.p>
            <motion.h3
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              도움이 되는 이야기
            </motion.h3>
          </div>
          <motion.div variants={fadeInUp}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              블로그 전체 보기
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {placeholderPosts.map((post) => (
            <motion.article key={post.slug} variants={fadeInUp}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/30 transition-colors"
              >
                {/* Thumbnail placeholder */}
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
                  </div>
                  <h4 className="font-semibold leading-snug group-hover:text-brand transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
