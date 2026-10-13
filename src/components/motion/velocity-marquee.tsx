"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { useRef } from "react";

// Bandeau de texte géant qui défile en continu et accélère avec la vitesse du scroll.
export function VelocityMarquee({ items, baseVelocity = -2, className = "" }: { items: string[]; baseVelocity?: number; className?: string }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const ligne = items.flatMap((t, i) => [
    <span key={`t${i}`}>{t}</span>,
    <span key={`s${i}`} className="mx-[0.3em] inline-block text-[0.5em] align-middle text-bissap">
      ✦
    </span>,
  ]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div className="inline-flex" style={{ x }}>
        <span className="inline-flex">{ligne}</span>
        <span className="inline-flex">{ligne}</span>
      </motion.div>
    </div>
  );
}
