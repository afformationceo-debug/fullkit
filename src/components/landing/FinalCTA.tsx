"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, FileText } from "lucide-react";
import { fadeInUp, staggerContainer, glowPulse, glowPulseSlow, blurIn } from "@/lib/animations/variants";
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

      {/* Floating geometric accents */}
      <div className="pointer-events-none absolute top-[15%] right-[20%] w-16 h-16 border border-brand/10 rounded-2xl rotate-12 animate-float" />
      <div className="pointer-events-none absolute bottom-[20%] left-[15%] w-10 h-10 border border-brand/8 rounded-xl -rotate-6 animate-float-delayed" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
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

          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
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
        </motion.div>
      </div>
    </section>
  );
}
