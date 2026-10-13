"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/components/cart";
import { Photo } from "@/components/photo";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";

const DUREE = 6000;
const ease = [0.25, 0.8, 0.25, 1] as const;

// Hero : chaque parfum vedette impose sa couleur à la scène.
// Changement de parfum instantané au clic (transitions courtes, sans attente).
export function Hero({ slides }: { slides: Produit[] }) {
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const { add } = useCart();
  const p = slides[index];
  const encre = p.theme.dark ? "#ffffff" : "#1a1a1a";

  const aller = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (pause) return;
    const t = setTimeout(() => aller(index + 1), DUREE);
    return () => clearTimeout(t);
  }, [index, pause, aller]);

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-96px)] items-center overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: p.theme.bg, color: encre }}
      onPointerEnter={() => setPause(true)}
      onPointerLeave={() => setPause(false)}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-28 pt-10 md:px-8 lg:grid-cols-[1fr_0.85fr] lg:py-16">
        {/* Texte */}
        <div className="relative order-2 min-h-[300px] lg:order-1 lg:min-h-[420px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={p.slug}
              className="absolute inset-x-0 top-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="text-2xl font-semibold md:text-3xl" style={{ color: p.theme.accent }}>
                {p.marque}
              </p>
              <h1 className="mt-2 text-[15vw] font-extrabold leading-[0.85] tracking-tighter sm:text-8xl lg:text-[8.5rem]">{p.nom}</h1>
              <p className="mt-6 max-w-md text-xl leading-snug opacity-85">{p.accroche}.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${p.univers}/${p.slug}`}
                  className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-transform hover:scale-[1.03]"
                  style={{ background: encre, color: p.theme.bg }}
                >
                  Découvrir <span aria-hidden>→</span>
                </Link>
                <button
                  onClick={() => add(p.slug, p.contenances[0].label)}
                  className="rounded-full border-2 px-7 py-[14px] text-base font-semibold transition-transform hover:scale-[1.03]"
                  style={{ borderColor: encre }}
                >
                  Ajouter · {formatFCFA(prixMin(p))} F
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Visuel en arche */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative aspect-[4/5] w-[72vw] max-w-[460px] overflow-hidden rounded-t-full" style={{ backgroundColor: p.theme.accent }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={p.slug}
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.4 } }}
                transition={{ duration: 0.6, ease }}
              >
                <Photo id={p.images[0]} alt={`${p.marque} ${p.nom}`} sizes="(max-width: 1024px) 72vw, 460px" priority={index === 0} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sélection des parfums */}
      <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-7xl items-end gap-3 px-4 md:gap-6 md:px-8">
        {slides.map((s, i) => (
          <button key={s.slug} onClick={() => aller(i)} className="group flex-1 text-left" aria-label={`Voir ${s.marque} ${s.nom}`} aria-current={i === index}>
            <span
              className={`block truncate text-sm font-semibold transition-opacity md:text-base ${i === index ? "opacity-100" : "opacity-50 group-hover:opacity-90"}`}
            >
              {s.nom}
            </span>
            <span className="relative mt-2 block h-[3px] overflow-hidden rounded-full" style={{ background: encre + "33" }}>
              {i === index ? (
                <motion.span
                  key={`actif-${index}-${pause}`}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: encre }}
                  initial={{ width: pause ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: pause ? 0 : DUREE / 1000, ease: "linear" }}
                />
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
