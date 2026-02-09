"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations/variants";
import { processSteps } from "@/lib/constants/process-steps";

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm text-muted-foreground mb-3"
          >
            진행 프로세스
          </motion.p>
          <motion.h3
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            이렇게 진행돼.
          </motion.h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12"
        >
          {/* Step Numbers */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar lg:overflow-visible">
            {processSteps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all ${
                  activeStep === index
                    ? "bg-brand/10 text-foreground border border-brand/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
                    activeStep === index
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted"
                  }`}
                >
                  {step.number}
                </span>
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border bg-card p-8 lg:p-10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-mono font-bold text-brand">
                    {processSteps[activeStep].number}
                  </span>
                  <div>
                    <h4 className="text-xl font-bold">
                      {processSteps[activeStep].title}
                    </h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      {processSteps[activeStep].description}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {processSteps[activeStep].detail}
                </p>

                <div className="flex flex-wrap gap-3">
                  {processSteps[activeStep].checklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2"
                    >
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
