"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
  scaleIn,
} from "@/lib/animations/variants";

const steps = [
  {
    number: "1",
    title: "신청서 작성",
    subtitle: "(30초면 돼)",
  },
  {
    number: "2",
    title: "전문가가 24시간 내 연락",
    subtitle: null,
  },
  {
    number: "3",
    title: "맞춤 견적 무료 제공",
    subtitle: null,
  },
];

export function QuickStartSection() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            무료 상담 1번이면 끝
          </motion.h3>

          {/* Steps */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 w-full"
          >
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Step card */}
                <motion.div
                  variants={scaleIn}
                  className="flex flex-col items-center text-center min-w-[160px]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand bg-brand/10 text-brand text-3xl font-bold">
                    {step.number}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </p>
                  {step.subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Connector arrow (hidden on mobile, shown on md+) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center mx-6">
                    <div className="h-px w-12 bg-border" />
                    <div className="h-0 w-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Bottom text */}
          <motion.p
            variants={fadeInUp}
            className="mt-14 text-lg text-foreground font-medium"
          >
            끝. 이제 시작해봐.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="mt-6">
            <Button asChild size="lg" className="bg-primary text-primary-foreground px-8 h-12 text-base rounded-xl">
              <Link href="/apply">프로젝트 신청하기</Link>
            </Button>
          </motion.div>

          {/* Tip */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-sm text-muted-foreground"
          >
            뭘 만들어야 할지 모르겠다면?{" "}
            <span className="text-brand">&rarr; 무료 상담으로 시작하세요</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
