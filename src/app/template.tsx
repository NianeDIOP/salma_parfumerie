"use client";

import { motion } from "motion/react";

// Transition entre les pages : un rideau bissap se retire, puis le contenu apparaît.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[90] origin-top bg-bissap"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
        aria-hidden
      />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.7, 0.1, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
