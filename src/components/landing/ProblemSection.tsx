"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  scaleIn,
} from "@/lib/animations/variants";
import { problemSolutions } from "@/lib/constants/problems";

export function ProblemSection() {
  return (
    <section className="bg-card py-16 md:py-24 lg:py-32">
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
            <span className="gradient-text">WhyKit</span>
            <span className="text-foreground">이 다 해결해.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-muted-foreground max-w-lg"
          >
            고객이 겪는 불편, 하나하나 해결했습니다.
          </motion.p>
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
              className="group relative rounded-2xl border border-border bg-background overflow-hidden transition-all duration-500 hover:border-brand/30 card-glow"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/[0.03] group-hover:to-transparent transition-all duration-500 pointer-events-none" />

              {/* Number badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-mono text-muted-foreground/30 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative p-6">
                {/* Problem */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive text-sm font-bold">
                    &times;
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    &ldquo;{item.problem}&rdquo;
                  </p>
                </div>

                {/* Arrow transition */}
                <div className="my-3 ml-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  <ArrowRight
                    size={14}
                    className="text-brand/40 group-hover:text-brand transition-colors duration-300"
                  />
                </div>

                {/* Solution */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                    &#10003;
                  </span>
                  <p className="font-semibold text-foreground leading-relaxed">
                    <span className="text-brand">{item.solution}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
