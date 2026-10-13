"use client";

import { motion } from "motion/react";
import { useSite } from "@/components/site-provider";

// Transition entre les pages : un rideau bissap se retire rapidement.
export default function Template({ children }: { children: React.ReactNode }) {
  const { reglages } = useSite();
  if (!reglages.identite.transitionPages) return children;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[90] origin-top bg-bissap"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
        aria-hidden
      />
      {children}
    </>
  );
}
