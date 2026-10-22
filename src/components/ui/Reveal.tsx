"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

/** Revela o conteúdo com fade + slide quando entra no ecrã (uma vez). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_PREMIUM, delay }}
    >
      {children}
    </motion.div>
  );
}
