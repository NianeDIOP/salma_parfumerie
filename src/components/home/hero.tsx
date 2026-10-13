"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/components/cart";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitText } from "@/components/motion/split-text";
import { Photo } from "@/components/photo";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";

const DUREE = 6500;
const ease = [0.7, 0, 0.2, 1] as const;

// Hero cinématique : chaque parfum vedette impose sa couleur à toute la scène.
export function Hero({ slides }: { slides: Produit[] }) {
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const { add } = useCart();
  const p = slides[index];
  const clair = p.theme.dark;
  const encre = clair ? "#ffffff" : "#1a1a1a";

  const aller = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (pause) return;
    const t = setTimeout(() => aller(index + 1), DUREE);
    return () => clearTimeout(t);
  }, [index, pause, aller]);

  // Parallaxe à la souris
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-30, 30]), { stiffness: 80, damping: 20 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 20 });

  const notes = [...p.pyramide.tete.slice(0, 1), ...p.pyramide.coeur.slice(0, 2), ...p.pyramide.fond.slice(0, 1)];
  const positions = [
    { left: "-14%", top: "14%" },
    { right: "-16%", top: "30%" },
    { left: "-18%", top: "62%" },
    { right: "-12%", top: "76%" },
  ];

  return (
    <motion.section
      className="grain relative isolate flex min-h-[calc(100svh-96px)] items-center overflow-hidden"
      animate={{ backgroundColor: p.theme.bg, color: encre }}
      transition={{ duration: 1.2, ease }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerEnter={() => setPause(true)}
      onPointerLeave={() => {
        setPause(false);
        mx.set(0);
        my.set(0);
      }}
    >
      {/* Nom géant en arrière-plan */}
      <AnimatePresence mode="popLayout">
        <motion.p
          key={p.slug + "-bg"}
          className="pointer-events-none absolute inset-x-0 bottom-[-0.12em] z-0 select-none whitespace-nowrap text-center text-[22vw] font-extrabold leading-none tracking-tighter"
          style={{ x: tx, WebkitTextStroke: `1px ${encre}`, color: "transparent", opacity: 0.22 }}
          initial={{ y: "40%", opacity: 0 }}
          animate={{ y: "0%", opacity: 0.22 }}
          exit={{ y: "-30%", opacity: 0 }}
          transition={{ duration: 1.2, ease }}
          aria-hidden
        >
          {p.marque}
        </motion.p>
      </AnimatePresence>

      {/* Halo de couleur */}
      <motion.div
        className="absolute -right-[10%] top-[10%] -z-0 size-[60vw] max-w-[900px] rounded-full blur-[120px]"
        style={{ x: tx, y: ty }}
        animate={{ backgroundColor: p.theme.accent, opacity: 0.35 }}
        transition={{ duration: 1.4 }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-28 pt-10 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-12">
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div key={p.slug} exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}>
              <motion.p
                className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <span className="h-px w-10 bg-current" />
                {String(index + 1).padStart(2, "0")} · {p.marque}
              </motion.p>
              <h1 className="mt-5 text-[13vw] font-extrabold leading-[0.88] tracking-tighter sm:text-7xl lg:text-[7.5rem]">
                <SplitText text={p.nom} delay={0.15} stagger={0.08} />
              </h1>
              <motion.p
                className="mt-6 max-w-md text-lg opacity-80"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                {p.accroche}. {p.type}, {p.famille.toLowerCase()}.
              </motion.p>
              <motion.div
                className="mt-9 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Magnetic>
                  <Link
                    href={`/${p.univers}/${p.slug}`}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold"
                    style={{ background: encre, color: p.theme.bg }}
                  >
                    <span className="relative z-10">Découvrir</span>
                    <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                </Magnetic>
                <button
                  onClick={() => add(p.slug, p.contenances[0].label)}
                  className="rounded-full border px-7 py-4 text-sm font-semibold transition hover:bg-white/10"
                  style={{ borderColor: encre }}
                >
                  Ajouter · {formatFCFA(prixMin(p))} F
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Visuel en arche */}
        <div className="order-1 flex justify-center lg:order-2" style={{ perspective: 1200 }}>
          <motion.div className="relative w-[68vw] max-w-[440px]" style={{ rotateX: rx, rotateY: ry }}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={p.slug}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.3 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.6 } }}
                  transition={{ duration: 1.3, ease }}
                  style={{ backgroundColor: p.theme.accent }}
                >
                  <Photo id={p.images[0]} alt={`${p.marque} ${p.nom}`} sizes="(max-width: 1024px) 70vw, 440px" priority={index === 0} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Notes olfactives flottantes */}
            <AnimatePresence mode="popLayout">
              {notes.map((n, i) => (
                <motion.span
                  key={p.slug + n}
                  className="absolute hidden whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[11px] shadow-lg backdrop-blur-md sm:block"
                  style={{ ...positions[i], background: clair ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.75)", color: encre }}
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    opacity: { delay: 0.7 + i * 0.12 },
                    scale: { delay: 0.7 + i * 0.12, type: "spring" },
                    y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  {n}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Navigation et progression */}
      <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-7xl items-center gap-6 px-4 md:px-8">
        <p className="font-mono text-xs tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
        <div className="flex flex-1 gap-2">
          {slides.map((s, i) => (
            <button key={s.slug} onClick={() => aller(i)} className="group relative h-8 flex-1" aria-label={`Voir ${s.nom}`}>
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 opacity-25" style={{ background: encre }} />
              {i === index ? (
                <motion.span
                  key={`actif-${index}`}
                  className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2"
                  style={{ background: encre }}
                  initial={{ width: "0%" }}
                  animate={{ width: pause ? "0%" : "100%" }}
                  transition={{ duration: pause ? 0.3 : DUREE / 1000, ease: "linear" }}
                />
              ) : (
                <span
                  className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 transition-all duration-500"
                  style={{ background: encre, width: i < index ? "100%" : "0%" }}
                />
              )}
              <span className="absolute -top-3 left-0 hidden text-[10px] opacity-0 transition group-hover:opacity-70 md:block">{s.nom}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["←", "→"].map((f, i) => (
            <button
              key={f}
              onClick={() => aller(index + (i ? 1 : -1))}
              className="grid size-10 place-items-center rounded-full border transition hover:scale-110"
              style={{ borderColor: encre }}
              aria-label={i ? "Suivant" : "Précédent"}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
