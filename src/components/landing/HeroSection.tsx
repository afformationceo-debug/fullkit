"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
  glowPulse,
  glowPulseSlow,
  hashtagStagger,
  hashtagItem,
  blurIn,
} from "@/lib/animations/variants";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Multiple animated gradient orbs for depth */}
      <motion.div
        variants={glowPulse}
        animate="animate"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.28 264 / 0.2) 0%, oklch(0.6 0.28 264 / 0.05) 40%, transparent 70%)",
        }}
      />
      <motion.div
        variants={glowPulseSlow}
        animate="animate"
        className="pointer-events-none absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 290 / 0.15) 0%, transparent 60%)",
        }}
      />
      <motion.div
        variants={glowPulseSlow}
        animate="animate"
        className="pointer-events-none absolute top-[60%] left-[35%] -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.2 240 / 0.1) 0%, transparent 60%)",
        }}
      />

      {/* Floating geometric accents */}
      <div className="pointer-events-none absolute top-[20%] right-[15%] w-20 h-20 border border-brand/10 rounded-2xl rotate-12 animate-float" />
      <div className="pointer-events-none absolute bottom-[25%] left-[12%] w-14 h-14 border border-brand/8 rounded-xl -rotate-6 animate-float-delayed" />
      <div className="pointer-events-none absolute top-[65%] right-[20%] w-8 h-8 bg-brand/5 rounded-lg rotate-45 animate-float-delayed" />

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
      >
        <motion.h1
          variants={blurIn}
          className="text-glow gradient-text text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
        >
          Full Kit
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-4 text-lg md:text-xl text-muted-foreground tracking-wide"
        >
          홈페이지. 앱. 솔루션. 자동화.
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="mt-10 text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug text-foreground whitespace-pre-line"
        >
          {"걱정하지 마.\n어려운 거 알아.\n그래서 만들었어."}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="btn-glow bg-brand text-brand-foreground px-10 h-13 text-base rounded-xl font-semibold shadow-lg shadow-brand/25"
          >
            <Link href="/apply">프로젝트 신청하기</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-kakao text-kakao-foreground px-10 h-13 text-base rounded-xl font-semibold hover:bg-kakao/90 transition-all hover:shadow-lg hover:shadow-kakao/20"
          >
            <Link
              href="https://pf.kakao.com/_fullkit"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오톡 상담
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={hashtagStagger}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {["#상상대로", "#다만들어", "#걱정은FullKit이"].map((tag) => (
            <motion.span
              key={tag}
              variants={hashtagItem}
              className="text-xs text-muted-foreground/50 px-3 py-1.5 rounded-full border border-border/50 hover:border-brand/30 hover:text-brand/60 transition-colors cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
