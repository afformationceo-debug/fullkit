"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations/variants";
import { industries } from "@/lib/constants/industries";

export function IndustryTargeting() {
  return (
    <section className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            어떤 산업이든, WhyKit이 만들어.
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-muted-foreground text-lg"
          >
            업종별 특화 경험으로 최적의 결과를 만들어 드립니다.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {industries.map((industry) => (
            <motion.div
              key={industry.id}
              variants={fadeInUp}
              className="group relative rounded-2xl border border-border bg-background p-6 lg:p-8 hover:border-brand/30 transition-colors"
            >
              <span className="text-4xl">{industry.emoji}</span>
              <h4 className="mt-4 text-lg font-semibold">{industry.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {industry.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {industry.keywords.slice(0, 2).map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
