"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Sparkles,
  BarChart3,
  PenTool,
  Users,
  MessageCircle,
  CalendarCheck,
  Map,
  Languages,
  Briefcase,
  Gamepad2,
  ShoppingBag,
} from "lucide-react";
import {
  fadeInUp,
  staggerContainerSlow,
} from "@/lib/animations/variants";

const portfolioItems = [
  {
    id: 1,
    icon: Globe,
    title: "메디큐어 의원",
    category: "의료",
    type: "프리미엄 홈페이지",
    description: "진료 예약률 40% 상승. 환자가 신뢰하는 프리미엄 병원 웹사이트.",
    stats: "예약률 40%↑",
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/15",
    featured: true,
  },
  {
    id: 2,
    icon: Sparkles,
    title: "루미에르 뷰티",
    category: "브랜드",
    type: "브랜드 홈페이지",
    description: "해외 감성의 프리미엄 브랜드 경험. 전환율 25% 상승.",
    stats: "전환율 25%↑",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/15",
  },
  {
    id: 3,
    icon: BarChart3,
    title: "세일즈 허브",
    category: "솔루션",
    type: "CRM 시스템",
    description: "고객 관리, 영업 파이프라인, 매출 분석까지 올인원.",
    stats: "업무효율 60%↑",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
  },
  {
    id: 4,
    icon: PenTool,
    title: "AI 블로그 엔진",
    category: "자동화",
    type: "AI 블로그 자동화",
    description: "키워드만 넣으면 SEO 최적화 글이 자동 생성 & 발행.",
    stats: "월 30편 자동발행",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
  {
    id: 5,
    icon: Users,
    title: "인플루언서 매칭",
    category: "자동화",
    type: "인플루언서 섭외 자동화",
    description: "AI가 브랜드에 맞는 인플루언서를 자동 매칭 & 제안.",
    stats: "섭외 시간 90%↓",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
  },
  {
    id: 6,
    icon: MessageCircle,
    title: "스마트 CS봇",
    category: "자동화",
    type: "CS 자동화 챗봇",
    description: "24시간 고객 응대. AI 챗봇이 FAQ부터 복잡한 문의까지.",
    stats: "응대시간 95%↓",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
  },
  {
    id: 7,
    icon: CalendarCheck,
    title: "북클리닉 예약",
    category: "플랫폼",
    type: "예약 플랫폼",
    description: "실시간 예약, 자동 알림, 일정 관리까지 원스톱 솔루션.",
    stats: "노쇼율 70%↓",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    featured: true,
  },
  {
    id: 8,
    icon: Map,
    title: "트래블 코리아",
    category: "플랫폼",
    type: "관광 플랫폼",
    description: "외국인 관광객 맞춤 여행 가이드. 다국어 지원.",
    stats: "MAU 5만+",
    iconColor: "text-teal-400",
    iconBg: "bg-teal-500/15",
  },
  {
    id: 9,
    icon: Languages,
    title: "글로벌 커넥트",
    category: "홈페이지",
    type: "글로벌 다국어 홈페이지",
    description: "한/영/일/중 4개국어. 글로벌 시장 진출의 시작.",
    stats: "해외 유입 300%↑",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
  },
  {
    id: 10,
    icon: Briefcase,
    title: "워크플로우 ERP",
    category: "솔루션",
    type: "사내 ERP 시스템",
    description: "인사, 재무, 프로젝트 관리를 하나의 시스템으로.",
    stats: "관리비용 45%↓",
    iconColor: "text-slate-400",
    iconBg: "bg-slate-500/15",
  },
  {
    id: 11,
    icon: Gamepad2,
    title: "플레이팜",
    category: "앱",
    type: "미니게임 웹앱",
    description: "이벤트용 미니게임으로 참여율 3배 상승. 바이럴 폭발.",
    stats: "참여율 3배↑",
    iconColor: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500/15",
  },
  {
    id: 12,
    icon: ShoppingBag,
    title: "스타일 마켓",
    category: "앱",
    type: "쇼핑몰 앱",
    description: "모바일 쇼핑 경험의 완성. 결제부터 배송 추적까지.",
    stats: "모바일 매출 200%↑",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15",
  },
];

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
            className="mt-3 text-muted-foreground max-w-lg"
          >
            다양한 산업, 다양한 솔루션. WhyKit이 만든 결과물입니다.
          </motion.p>
        </motion.div>

        {/* Module cards grid */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {portfolioItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className={item.featured ? "lg:col-span-2" : ""}
              >
                <div className="group relative h-full rounded-2xl border border-border bg-card p-6 hover:border-brand/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5">
                  {/* Top row: icon + stats */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                      <Icon size={22} className={item.iconColor} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">
                      {item.stats}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                    {item.title}
                  </h4>

                  {/* Subtitle */}
                  <div className="flex items-center gap-2 mt-1.5 mb-3">
                    <span className="text-xs font-medium text-brand/80">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground/50">|</span>
                    <span className="text-xs text-muted-foreground">
                      {item.type}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
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
