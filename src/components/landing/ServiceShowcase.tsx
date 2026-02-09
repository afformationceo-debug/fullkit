"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fadeInUp,
  staggerContainer,
  fadeIn,
} from "@/lib/animations/variants";
import { services } from "@/lib/constants/services";

export function ServiceShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const activeService = services[activeTab];

  return (
    <section id="services" className="bg-card py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-black text-foreground tracking-tight"
          >
            WhyKit이 알아서 만드는 것들
          </motion.h3>

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-lg md:text-xl text-muted-foreground font-medium"
          >
            넌 아이디어만 말해. 끝까지 만들어줄게.
          </motion.p>
        </motion.div>

        {/* Tab navigation with fading mask */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 flex justify-center relative"
        >
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent z-10 md:hidden" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent z-10 md:hidden" />
          
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 rounded-2xl bg-background/50 backdrop-blur-md p-1.5 border border-border/50">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-brand text-brand-foreground shadow-lg shadow-brand/20 scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{service.title}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab content */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="rounded-2xl border border-border bg-background p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: description + features */}
                <div>
                  <p className="text-sm font-medium text-brand uppercase tracking-wider">
                    {activeService.tagline}
                  </p>
                  <h4 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
                    {activeService.title}
                  </h4>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {activeService.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {activeService.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: targets + CTA */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      이런 분들에게 추천
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeService.targets.map((target, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-lg px-3 py-1 text-sm"
                        >
                          {target}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <Button asChild size="lg" className="w-full md:w-auto bg-brand text-brand-foreground px-8 h-12 text-base rounded-xl hover:bg-brand/90">
                      <Link href={`/apply?service=${activeService.id}`}>
                        견적 문의
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
