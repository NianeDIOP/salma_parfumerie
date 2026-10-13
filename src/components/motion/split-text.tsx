"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

const word: Variants = {
  hidden: { y: "110%", rotate: 4 },
  visible: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.2, 0.7, 0.1, 1] } },
};

// Titre révélé mot par mot, chaque mot glissant hors d'un masque.
export function SplitText({
  text,
  className = "",
  stagger = 0.06,
  inView = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  inView?: boolean;
  delay?: number;
}) {
  const trigger = inView ? { whileInView: "visible", viewport: { once: true, margin: "-10%" } } : { animate: "visible" };
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      custom={stagger}
      initial="hidden"
      transition={{ delayChildren: delay }}
      {...trigger}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span className="inline-block" variants={word} style={{ transformOrigin: "left bottom" }}>
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
