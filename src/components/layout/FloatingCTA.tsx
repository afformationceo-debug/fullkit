"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, FileText } from "lucide-react";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

export function FloatingCTA() {
  const { scrollY } = useScrollDirection();
  const isVisible = scrollY > 600;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop: Bottom-right floating buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-3"
          >
            <Link
              href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-kakao px-5 py-3 text-sm font-medium text-kakao-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle size={18} />
              카카오톡 상담
            </Link>
            <Link
              href="/apply"
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <FileText size={18} />
              프로젝트 신청
            </Link>
          </motion.div>

          {/* Mobile: Bottom full-width bar */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="flex gap-2 p-3">
              <Link
                href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-kakao px-4 py-3 text-sm font-medium text-kakao-foreground"
              >
                <MessageCircle size={16} />
                카카오톡 상담
              </Link>
              <Link
                href="/apply"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
              >
                <FileText size={16} />
                프로젝트 신청
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
