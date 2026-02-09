"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations/variants";
import { testimonials } from "@/lib/constants/testimonials";
import { Star } from "lucide-react";

const row1 = testimonials.slice(0, 8);
const row2 = testimonials.slice(8, 16);

function TestimonialCard({
  content,
  author,
  role,
}: {
  content: string;
  author: string;
  role: string;
}) {
  return (
    <div className="flex-shrink-0 w-[340px] rounded-xl border border-border bg-card p-6 mx-2 hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 group">
      {/* Star rating */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-amber-400 text-amber-400"
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">
        &ldquo;{content}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand/30 to-brand/10 flex items-center justify-center text-xs font-semibold text-brand">
          {author[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
  return (
    <section id="testimonials" className="bg-card py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm text-muted-foreground mb-3"
          >
            먼저 맡겨본 분들의 후기
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            실제 고객분들이 직접 남긴
            <br />
            <span className="gradient-text">리얼 후기</span>입니다
          </motion.h2>
        </motion.div>
      </div>

      {/* Marquee Row 1 → with fade edges */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard
              key={`r1-${i}`}
              content={t.content}
              author={t.author}
              role={t.role}
            />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 ← with fade edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...row2, ...row2].map((t, i) => (
            <TestimonialCard
              key={`r2-${i}`}
              content={t.content}
              author={t.author}
              role={t.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
