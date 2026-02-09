"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

const navItems = [
  { label: "서비스", href: "#services" },
  { label: "포트폴리오", href: "#portfolio" },
  { label: "프로세스", href: "#process" },
  { label: "후기", href: "#testimonials" },
  { label: "블로그", href: "/blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollDirection, scrollY } = useScrollDirection();
  const isScrolled = scrollY > 20;
  const isHidden = scrollDirection === "down" && scrollY > 300;

  // Stagger variants for mobile menu items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: -10, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/70 backdrop-blur-2xl border-b border-border/40 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-brand group-hover:to-brand/70 transition-all duration-300">
                WhyKit
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground/80 hover:text-foreground transition-all hover:scale-105"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-brand/5 text-muted-foreground hover:text-brand transition-colors">
                <Link href="/apply">문의하기</Link>
              </Button>
              <Button size="sm" asChild className="bg-brand text-brand-foreground hover:bg-brand/90 px-6 rounded-full font-bold shadow-lg shadow-brand/20 transition-all hover:scale-105 active:scale-95">
                <Link href="/apply">프로젝트 신청</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors relative z-50"
              aria-label="메뉴 열기"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden"
          >
            <motion.nav 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center h-full gap-8 p-8"
            >
              {navItems.map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-bold text-muted-foreground hover:text-brand transition-all active:scale-90"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full max-w-xs mt-8">
                <Button variant="outline" size="lg" asChild className="w-full rounded-2xl border-brand/20 text-brand">
                  <Link href="/apply" onClick={() => setMobileOpen(false)}>
                    문의하기
                  </Link>
                </Button>
                <Button size="lg" asChild className="w-full bg-brand text-brand-foreground rounded-2xl shadow-xl shadow-brand/20">
                  <Link href="/apply" onClick={() => setMobileOpen(false)}>
                    프로젝트 신청
                  </Link>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
