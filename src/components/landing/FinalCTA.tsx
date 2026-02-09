"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, FileText, ArrowRight } from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  glowPulse,
  glowPulseSlow,
  blurIn,
} from "@/lib/animations/variants";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-32 lg:py-44 overflow-hidden">
      {/* Multiple Background Glows */}
      <motion.div
        variants={glowPulse}
        animate="animate"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        variants={glowPulseSlow}
        animate="animate"
        className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 290 / 0.12) 0%, transparent 60%)",
        }}
      />
      <motion.div
        variants={glowPulseSlow}
        animate="animate"
        className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.2 240 / 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Floating geometric accents */}
      <div className="pointer-events-none absolute top-[15%] right-[20%] w-16 h-16 border border-brand/10 rounded-2xl rotate-12 animate-float" />
      <div className="pointer-events-none absolute bottom-[20%] left-[15%] w-10 h-10 border border-brand/8 rounded-xl -rotate-6 animate-float-delayed" />
      <div className="pointer-events-none absolute top-[70%] right-[25%] w-6 h-6 bg-brand/5 rounded-lg rotate-45 animate-float" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Stats row */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-8 md:gap-16 mb-12"
          >
            {[
              { number: "300+", label: "완료 프로젝트" },
              { number: "98%", label: "고객 만족도" },
              { number: "1년", label: "무상 유지보수" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-2xl md:text-3xl font-bold gradient-text">
                  {stat.number}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground mb-6"
          >
            상담 한 번이면 돼.
          </motion.p>

          <motion.h2
            variants={blurIn}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-glow gradient-text"
          >
            WhyKit이
          </motion.h2>
          <motion.h2
            variants={blurIn}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-glow mt-2 text-foreground"
          >
            알아서 할게.
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-muted-foreground max-w-md mx-auto"
          >
            뭘 만들지 모르겠어도 괜찮아. 상담부터 시작하면 돼.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="btn-glow text-base px-10 py-6 bg-brand text-brand-foreground rounded-xl font-semibold shadow-lg shadow-brand/25"
            >
              <Link href="/apply">
                <FileText size={18} className="mr-2" />
                지금 시작하기
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="text-base px-10 py-6 bg-kakao text-kakao-foreground border-kakao rounded-xl font-semibold hover:bg-kakao/90 transition-all hover:shadow-lg hover:shadow-kakao/20"
            >
              <Link
                href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} className="mr-2" />
                카카오톡 상담
              </Link>
            </Button>
          </motion.div>

          {/* Bottom trust signals */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground/60"
          >
            <span className="flex items-center gap-1">
              <ArrowRight size={10} /> 무료 상담
            </span>
            <span className="flex items-center gap-1">
              <ArrowRight size={10} /> 24시간 내 연락
            </span>
            <span className="flex items-center gap-1">
              <ArrowRight size={10} /> 견적 무료
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
