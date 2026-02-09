"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  fadeInUp,
  staggerContainerSlow,
  cardHover,
} from "@/lib/animations/variants";

const portfolioItems = [
  {
    id: 1,
    title: "메디큐어 병원",
    category: "의료/병원",
    type: "홈페이지",
    description: "신뢰감을 주는 프리미엄 병원 웹사이트",
    gradient: "from-blue-600/40 to-indigo-800/40",
  },
  {
    id: 2,
    title: "피트니스 앱",
    category: "헬스케어",
    type: "모바일 앱",
    description: "개인 맞춤형 운동 루틴 관리 앱",
    gradient: "from-emerald-600/40 to-teal-800/40",
  },
  {
    id: 3,
    title: "스마트 물류",
    category: "물류/유통",
    type: "솔루션",
    description: "실시간 재고 관리 및 배송 추적 시스템",
    gradient: "from-amber-600/40 to-orange-800/40",
  },
  {
    id: 4,
    title: "크래프트 커피",
    category: "F&B",
    type: "홈페이지 + 쇼핑몰",
    description: "감성적인 브랜드 경험을 담은 커피 쇼핑몰",
    gradient: "from-rose-600/40 to-pink-800/40",
  },
  {
    id: 5,
    title: "에듀 플랫폼",
    category: "교육",
    type: "웹 솔루션",
    description: "AI 기반 맞춤 학습 관리 플랫폼",
    gradient: "from-violet-600/40 to-purple-800/40",
  },
  {
    id: 6,
    title: "자동화 마케팅",
    category: "마케팅",
    type: "자동화",
    description: "SNS 콘텐츠 자동 생성 및 스케줄링 시스템",
    gradient: "from-cyan-600/40 to-sky-800/40",
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
        </motion.div>

        {/* Portfolio grid */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              initial="rest"
              whileHover="hover"
            >
              <motion.div
                variants={cardHover}
                className="group relative aspect-video overflow-hidden rounded-xl bg-muted cursor-pointer"
              >
                {/* Placeholder gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-110`}
                />

                {/* Subtle grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Hover overlay with project info */}
                <div className="absolute inset-0 flex flex-col justify-end bg-black/0 p-5 transition-all duration-300 group-hover:bg-black/60 backdrop-blur-0 group-hover:backdrop-blur-[2px]">
                  <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm">{item.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm">{item.type}</span>
                    </div>
                    <h4 className="mt-2 text-lg font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-white/80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-muted-foreground">아직 더 있어.</p>
          <Link
            href="#"
            className="text-brand font-medium hover:underline underline-offset-4 transition-colors"
          >
            포트폴리오 전체 보기 &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
