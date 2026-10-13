"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Contenu qui se déplace plus lentement que la page (effet de profondeur).
export function Parallax({ children, offset = 80, className = "" }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-[-12%]" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// Image révélée par un volet de couleur lorsqu'elle entre dans l'écran.
export function RevealImage({ children, color = "var(--color-bissap)", className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.6, ease: [0.2, 0.7, 0.1, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 z-10 origin-top"
        style={{ background: color }}
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
      />
    </div>
  );
}
