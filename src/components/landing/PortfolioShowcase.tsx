"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  fadeInUp,
  staggerContainerSlow,
} from "@/lib/animations/variants";

const portfolioItems = [
  {
    id: 1,
    title: "메디큐어 의원",
    category: "의료",
    type: "프리미엄 홈페이지",
    description: "진료 예약률 40% 상승. 환자가 신뢰하는 프리미엄 병원 웹사이트.",
    gradient: "from-sky-500/30 to-blue-700/40",
    colSpan: 2,
    stats: "예약률 40%↑",
    mockVariant: "medical" as const,
  },
  {
    id: 2,
    title: "루미에르 뷰티",
    category: "브랜드",
    type: "브랜드 홈페이지",
    description: "해외 감성의 프리미엄 브랜드 경험. 전환율 25% 상승.",
    gradient: "from-rose-500/30 to-pink-700/40",
    colSpan: 1,
    stats: "전환율 25%↑",
    mockVariant: "brand" as const,
  },
  {
    id: 3,
    title: "세일즈 허브",
    category: "솔루션",
    type: "CRM 시스템",
    description: "고객 관리, 영업 파이프라인, 매출 분석까지 올인원.",
    gradient: "from-violet-500/30 to-purple-700/40",
    colSpan: 1,
    stats: "업무효율 60%↑",
    mockVariant: "dashboard" as const,
  },
  {
    id: 4,
    title: "AI 블로그 엔진",
    category: "자동화",
    type: "AI 블로그 자동화",
    description: "키워드만 넣으면 SEO 최적화 글이 자동 생성 & 발행.",
    gradient: "from-emerald-500/30 to-teal-700/40",
    colSpan: 1,
    stats: "월 30편 자동발행",
    mockVariant: "editor" as const,
  },
  {
    id: 5,
    title: "인플루언서 매칭",
    category: "자동화",
    type: "인플루언서 섭외 자동화",
    description: "AI가 브랜드에 맞는 인플루언서를 자동 매칭 & 제안.",
    gradient: "from-amber-500/30 to-orange-700/40",
    colSpan: 1,
    stats: "섭외 시간 90%↓",
    mockVariant: "cards" as const,
  },
  {
    id: 6,
    title: "스마트 CS봇",
    category: "자동화",
    type: "CS 자동화 챗봇",
    description: "24시간 고객 응대. AI 챗봇이 FAQ부터 복잡한 문의까지.",
    gradient: "from-cyan-500/30 to-sky-700/40",
    colSpan: 1,
    stats: "응대시간 95%↓",
    mockVariant: "chat" as const,
  },
  {
    id: 7,
    title: "북클리닉 예약",
    category: "플랫폼",
    type: "예약 플랫폼",
    description: "실시간 예약, 자동 알림, 일정 관리까지 원스톱 솔루션.",
    gradient: "from-indigo-500/30 to-blue-800/40",
    colSpan: 2,
    stats: "노쇼율 70%↓",
    mockVariant: "calendar" as const,
  },
  {
    id: 8,
    title: "트래블 코리아",
    category: "플랫폼",
    type: "관광 플랫폼",
    description: "외국인 관광객 맞춤 여행 가이드. 다국어 지원.",
    gradient: "from-teal-500/30 to-emerald-700/40",
    colSpan: 1,
    stats: "MAU 5만+",
    mockVariant: "browser" as const,
  },
  {
    id: 9,
    title: "글로벌 커넥트",
    category: "홈페이지",
    type: "글로벌 다국어 홈페이지",
    description: "한/영/일/중 4개국어. 글로벌 시장 진출의 시작.",
    gradient: "from-blue-500/30 to-indigo-700/40",
    colSpan: 1,
    stats: "해외 유입 300%↑",
    mockVariant: "browser" as const,
  },
  {
    id: 10,
    title: "워크플로우 ERP",
    category: "솔루션",
    type: "사내 ERP 시스템",
    description: "인사, 재무, 프로젝트 관리를 하나의 시스템으로.",
    gradient: "from-slate-500/30 to-gray-700/40",
    colSpan: 1,
    stats: "관리비용 45%↓",
    mockVariant: "dashboard" as const,
  },
  {
    id: 11,
    title: "플레이팜",
    category: "앱",
    type: "미니게임 웹앱",
    description: "이벤트용 미니게임으로 참여율 3배 상승. 바이럴 폭발.",
    gradient: "from-fuchsia-500/30 to-purple-700/40",
    colSpan: 2,
    stats: "참여율 3배↑",
    mockVariant: "game" as const,
  },
  {
    id: 12,
    title: "스타일 마켓",
    category: "앱",
    type: "쇼핑몰 앱",
    description: "모바일 쇼핑 경험의 완성. 결제부터 배송 추적까지.",
    gradient: "from-orange-500/30 to-red-700/40",
    colSpan: 1,
    stats: "모바일 매출 200%↑",
    mockVariant: "app" as const,
  },
];

// Icon components for each mockVariant
function MockMedical() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">🏥</div>
      <div className="flex gap-1.5">
        <div className="h-1.5 w-8 rounded bg-white/15" />
        <div className="h-1.5 w-6 rounded bg-white/10" />
      </div>
    </div>
  );
}

function MockBrand() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">✨</div>
      <div className="h-1.5 w-12 rounded bg-white/15" />
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="w-full space-y-1.5 px-1">
      <div className="flex gap-1.5">
        <div className="h-5 flex-1 rounded bg-white/8" />
        <div className="h-5 flex-1 rounded bg-white/6" />
        <div className="h-5 flex-1 rounded bg-white/10" />
      </div>
      <div className="h-8 w-full rounded bg-white/5" />
    </div>
  );
}

function MockEditor() {
  return (
    <div className="w-full space-y-1 px-1">
      <div className="h-2 w-3/4 rounded bg-white/15" />
      <div className="h-1.5 w-full rounded bg-white/8" />
      <div className="h-1.5 w-5/6 rounded bg-white/6" />
      <div className="h-1.5 w-2/3 rounded bg-white/8" />
    </div>
  );
}

function MockCards() {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-1">
      <div className="h-8 rounded bg-white/8 flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-white/15"/></div>
      <div className="h-8 rounded bg-white/6 flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-white/12"/></div>
    </div>
  );
}

function MockChat() {
  return (
    <div className="w-full space-y-1.5 px-1">
      <div className="flex justify-start"><div className="h-3 w-16 rounded-full bg-white/10" /></div>
      <div className="flex justify-end"><div className="h-3 w-12 rounded-full bg-white/15" /></div>
      <div className="flex justify-start"><div className="h-3 w-20 rounded-full bg-white/8" /></div>
    </div>
  );
}

function MockCalendar() {
  return (
    <div className="grid grid-cols-5 gap-1 px-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`h-4 rounded ${i === 3 || i === 7 ? "bg-white/20" : "bg-white/6"}`} />
      ))}
    </div>
  );
}

function MockApp() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-8 h-12 rounded-lg bg-white/10 border border-white/15" />
      <div className="h-1.5 w-10 rounded bg-white/10" />
    </div>
  );
}

function MockGame() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded bg-white/15 rotate-12" />
      <div className="w-8 h-8 rounded-lg bg-white/20" />
      <div className="w-6 h-6 rounded bg-white/10 -rotate-12" />
    </div>
  );
}

function MockBrowser() {
  return (
    <div className="w-full space-y-1.5 px-1">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="ml-1 h-2 flex-1 rounded bg-white/8" />
      </div>
      <div className="h-6 rounded bg-white/6" />
    </div>
  );
}

const mockComponents: Record<string, () => React.JSX.Element> = {
  medical: MockMedical,
  brand: MockBrand,
  dashboard: MockDashboard,
  editor: MockEditor,
  cards: MockCards,
  chat: MockChat,
  calendar: MockCalendar,
  browser: MockBrowser,
  app: MockApp,
  game: MockGame,
};

export function PortfolioShowcase() {
  return (
    <section id="portfolio" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
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

        {/* Bento grid */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {portfolioItems.map((item) => {
            const MockComponent = mockComponents[item.mockVariant] || MockBrowser;
            return (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className={item.colSpan === 2 ? "lg:col-span-2" : ""}
              >
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-brand/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5">
                  {/* Visual area */}
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${item.gradient}`}
                    style={{ aspectRatio: item.colSpan === 2 ? "3/1" : "16/9" }}
                  >
                    {/* Grid pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                    {/* Mock icon */}
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <MockComponent />
                    </div>
                    {/* Stats badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/15">
                        {item.stats}
                      </span>
                    </div>
                  </div>

                  {/* Info area - always visible */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground group-hover:text-brand transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
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
