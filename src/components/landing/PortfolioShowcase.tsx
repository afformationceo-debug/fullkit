"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Settings,
  Zap,
} from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  staggerContainerSlow,
} from "@/lib/animations/variants";

const serviceModules = [
  {
    id: "homepage",
    icon: Globe,
    title: "홈페이지",
    tagline: "첫인상이 곧 매출",
    description: "브랜드의 얼굴. 디자인부터 SEO까지 한 번에.",
    examples: [
      { name: "메디큐어 의원", tag: "의료", stat: "예약률 40%↑" },
      { name: "루미에르 뷰티", tag: "브랜드", stat: "전환율 25%↑" },
      { name: "글로벌 커넥트", tag: "다국어", stat: "해외 유입 300%↑" },
    ],
  },
  {
    id: "app",
    icon: Smartphone,
    title: "앱",
    tagline: "아이디어를 손 안에",
    description: "기획부터 출시까지. 앱스토어 등록 지원.",
    examples: [
      { name: "플레이팜", tag: "미니게임", stat: "참여율 3배↑" },
      { name: "스타일 마켓", tag: "쇼핑몰", stat: "모바일 매출 200%↑" },
      { name: "트래블 코리아", tag: "관광", stat: "MAU 5만+" },
    ],
  },
  {
    id: "solution",
    icon: Settings,
    title: "솔루션",
    tagline: "업무 효율의 끝판왕",
    description: "CRM, ERP, 예약 시스템 등 맞춤 솔루션.",
    examples: [
      { name: "세일즈 허브", tag: "CRM", stat: "업무효율 60%↑" },
      { name: "워크플로우 ERP", tag: "ERP", stat: "관리비용 45%↓" },
      { name: "북클리닉 예약", tag: "예약", stat: "노쇼율 70%↓" },
    ],
  },
  {
    id: "automation",
    icon: Zap,
    title: "자동화",
    tagline: "반복 작업, AI가 대신",
    description: "블로그, 챗봇, 매칭 등 AI 기반 자동화.",
    examples: [
      { name: "AI 블로그 엔진", tag: "콘텐츠", stat: "월 30편 자동발행" },
      { name: "인플루언서 매칭", tag: "마케팅", stat: "섭외 시간 90%↓" },
      { name: "스마트 CS봇", tag: "고객응대", stat: "응대시간 95%↓" },
    ],
  },
];

export function PortfolioShowcase() {
  return (
    <section id="portfolio" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs tracking-widest text-brand uppercase font-mono"
          >
            REAL WORK
          </motion.p>

          <motion.h3
            variants={fadeInUp}
            className="mt-3 text-3xl md:text-5xl font-bold text-foreground"
          >
            실제로 만든 것들
          </motion.h3>

          <motion.p
            variants={fadeInUp}
            className="mt-3 text-muted-foreground"
          >
            다양한 산업, 다양한 솔루션. WhyKit이 만든 결과물입니다.
          </motion.p>
        </motion.div>

        {/* 4 Service module cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {serviceModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div key={mod.id} variants={fadeInUp}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 md:p-8 hover:border-brand/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5">
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">
                        {mod.title}
                      </h4>
                      <p className="text-sm text-brand">{mod.tagline}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-5">
                    {mod.description}
                  </p>

                  {/* Example projects */}
                  <div className="space-y-2.5">
                    {mod.examples.map((ex) => (
                      <div
                        key={ex.name}
                        className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-semibold text-foreground">
                            {ex.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-medium">
                            {ex.tag}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-brand">
                          {ex.stat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-muted-foreground">
            이건 일부예요. 더 많은 프로젝트가 있습니다.
          </p>
          <Link
            href="/apply"
            className="text-brand font-medium hover:underline underline-offset-4 transition-colors"
          >
            내 프로젝트도 맡겨보기 &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
