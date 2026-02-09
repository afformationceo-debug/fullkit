"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  scaleIn,
} from "@/lib/animations/variants";
import { problemSolutions } from "@/lib/constants/problems";

export function ProblemSection() {
  return (
    <section className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm text-muted-foreground"
          >
            외주 제작에 대한 이런 말들.
          </motion.p>

          <motion.h2
            variants={fadeInUp}
            className="mt-3 text-3xl md:text-5xl font-bold"
          >
            <span className="gradient-text">Full Kit</span>
            <span className="text-foreground">이 다 해결해.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {problemSolutions.map((item, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group relative rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-brand/30 card-glow"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/[0.02] group-hover:to-transparent transition-all duration-500 pointer-events-none" />

              {/* Problem */}
              <div className="relative flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive text-sm font-bold">
                  &times;
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  &ldquo;{item.problem}&rdquo;
                </p>
              </div>

              {/* Solution */}
              <div className="relative mt-4 flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                  &#10003;
                </span>
                <p className="font-semibold text-foreground leading-relaxed">
                  <span className="text-brand">{item.solution}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
