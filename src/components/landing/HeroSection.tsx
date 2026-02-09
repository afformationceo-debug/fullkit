"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
  glowPulse,
  glowPulseSlow,
  hashtagStagger,
  hashtagItem,
} from "@/lib/animations/variants";

const blurIn = fadeInUp;

const rotatingWords = ["홈페이지", "앱", "솔루션", "자동화", "뭐든지"];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Smoothed mouse tracking for the glow
  const springConfig = { damping: 25, stiffness: 150 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20">
      {/* Interactive Mouse Glow Layer */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full opacity-20 lg:opacity-30 mix-blend-screen hidden sm:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.28 264 / 0.15) 0%, transparent 70%)",
          left: glowX,
          top: glowY,
        }}
      />

      {/* Static Orbs for depth */}
      <motion.div
        variants={glowPulse}
        animate="animate"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.28 264 / 0.1) 0%, oklch(0.6 0.28 264 / 0.05) 40%, transparent 70%)",
        }}
      />
      <motion.div
        variants={glowPulseSlow}
        animate="animate"
        className="pointer-events-none absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 290 / 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Floating geometric accents with enhanced motion */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0], 
          rotate: [12, 20, 12],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-[20%] right-[15%] w-24 h-24 border border-brand/20 rounded-3xl" 
      />
      <motion.div 
        animate={{ 
          y: [0, 15, 0], 
          rotate: [-6, -15, -6],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-[25%] left-[12%] w-16 h-16 border border-brand/15 rounded-2xl" 
      />
      
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
      >
        {/* Main title - Optimized for Mobile */}
        <motion.h1
          variants={blurIn}
          className="text-glow gradient-text text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
        >
          WhyKit
        </motion.h1>

        {/* Rotating word + tagline */}
        <motion.div
          variants={fadeInUp}
          className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
        >
          <div className="relative overflow-hidden text-4xl md:text-6xl lg:text-7xl h-[1.2em] w-[6em] md:w-[5em]">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[wordIndex]}
                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center font-bold gradient-text"
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-3xl md:text-6xl lg:text-7xl font-bold text-foreground/80">
            다 만든다.
          </span>
        </motion.div>

        {/* Emotional copy */}
        <div className="mt-12 space-y-2">
          {["걱정하지 마.", "어려운 거 알아.", "그래서 우리가 왔어."].map(
            (line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.2 + i * 0.3,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`text-lg md:text-2xl lg:text-3xl font-medium tracking-tight ${
                  i === 2 ? "text-foreground font-bold" : "text-foreground/50"
                }`}
              >
                {line}
              </motion.p>
            )
          )}
        </div>

        {/* Stats bar - Responsive Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 md:gap-16 bg-foreground/[0.03] backdrop-blur-md border border-white/5 px-10 py-6 rounded-3xl"
        >
          {[
            { number: "300+", label: "프로젝트" },
            { number: "98%", label: "고객 만족" },
            { number: "~2주", label: "평균 납기" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 min-w-[80px]">
              <span className="text-2xl md:text-3xl font-black text-foreground tabular-nums">
                {stat.number}
              </span>
              <span className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 flex flex-col sm:flex-row items-center gap-5"
        >
          <Button
            asChild
            size="lg"
            className="btn-glow bg-brand text-brand-foreground px-12 h-14 text-lg rounded-2xl font-bold shadow-2xl shadow-brand/30 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/apply">프로젝트 신청하기</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-background/50 backdrop-blur-md border-white/10 text-foreground px-12 h-14 text-lg rounded-2xl font-bold hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
          >
            <Link
              href="https://pf.kakao.com/_whykit"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오톡 상담
            </Link>
          </Button>
        </motion.div>

        {/* Hashtags */}
        <motion.div
          variants={hashtagStagger}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {["#상상대로", "#다만들어", "#걱정은WhyKit이"].map((tag) => (
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
        transition={{ delay: 3, duration: 1 }}
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
