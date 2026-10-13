"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// Curseur signature en forme de goutte (ordinateur uniquement).
// Il grossit sur les éléments interactifs et affiche « Voir » sur les produits ([data-cursor="voir"]).
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [mode, setMode] = useState<"default" | "hover" | "voir">("default");
  const [actif, setActif] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- activation unique sur ordinateur
    setActif(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="voir"]')) setMode("voir");
      else if (t.closest("a, button, input, select, label")) setMode("hover");
      else setMode("default");
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!actif) return null;

  const size = mode === "voir" ? 84 : mode === "hover" ? 44 : 14;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden mix-blend-difference md:block"
      style={{ x: sx, y: sy }}
      aria-hidden
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center bg-white"
        animate={{ width: size, height: size, borderRadius: mode === "default" ? "50% 50% 50% 0" : "50%", rotate: mode === "default" ? -45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <AnimatePresence>
          {mode === "voir" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[11px] uppercase tracking-widest text-black"
            >
              Voir
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
