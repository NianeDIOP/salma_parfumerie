"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { Photo } from "@/components/photo";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";

const DUREE = 6000;
const ease = [0.25, 0.8, 0.25, 1] as const;

// Hero : chaque parfum vedette impose sa couleur à la scène.
// Changement de parfum instantané au clic (transitions courtes, sans attente).
export function Hero({ slides }: { slides: Produit[] }) {
  const [index, setIndex] = useState(0);
  const [sens, setSens] = useState(1);
  const { add } = useCart();
  const p = slides[index];
  const encre = p.theme.dark ? "#ffffff" : "#1a1a1a";

  const debutX = useRef<number | null>(null);
  const aller = useCallback(
    (i: number, direction = 1) => {
      setSens(direction);
      setIndex((i + slides.length) % slides.length);
    },
    [slides.length],
  );
  const suivant = () => aller(index + 1, 1);
  const precedent = () => aller(index - 1, -1);

  useEffect(() => {
    // Défilement automatique : le minuteur repart à chaque changement de parfum
    const t = setTimeout(() => aller(index + 1, 1), DUREE);
    return () => clearTimeout(t);
  }, [index, aller]);

  return (
    <section
      className="relative isolate flex touch-pan-y items-center overflow-hidden transition-colors duration-500 md:min-h-[calc(100svh-72px)]"
      style={{ backgroundColor: p.theme.bg, color: encre }}
      // Glisser le doigt à gauche / à droite pour changer de parfum
      onPointerDown={(e) => (debutX.current = e.clientX)}
      onPointerUp={(e) => {
        if (debutX.current === null) return;
        const dx = e.clientX - debutX.current;
        debutX.current = null;
        if (Math.abs(dx) > 50) (dx < 0 ? suivant : precedent)();
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-4 pb-16 pt-6 md:gap-10 md:px-8 md:pb-28 md:pt-10 lg:grid-cols-[1fr_0.85fr] lg:py-16">
        {/* Texte */}
        <div className="relative order-2 min-h-[250px] lg:order-1 lg:min-h-[420px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={p.slug}
              className="absolute inset-x-0 top-0"
              initial={{ opacity: 0, x: 40 * sens }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 * sens }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="text-xl font-semibold md:text-3xl" style={{ color: p.theme.accent }}>
                {p.marque}
              </p>
              <h1 className="mt-1 text-[14vw] font-extrabold leading-[0.85] tracking-tighter sm:text-8xl lg:text-[8.5rem]">{p.nom}</h1>
              <p className="mt-4 max-w-md text-lg leading-snug opacity-85 md:mt-6 md:text-xl">{p.accroche}.</p>
              <div className="mt-6 flex items-center gap-3 md:mt-9">
                <Link
                  href={`/${p.univers}/${p.slug}`}
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-full px-6 py-4 text-base font-semibold transition-transform active:scale-95 md:flex-none md:px-8 md:hover:scale-[1.03]"
                  style={{ background: encre, color: p.theme.bg }}
                >
                  Découvrir <span aria-hidden>→</span>
                </Link>
                <button
                  onClick={() => add(p.slug, p.contenances[0].label)}
                  className="flex-1 whitespace-nowrap rounded-full border-2 px-5 py-[14px] text-base font-semibold transition-transform active:scale-95 md:flex-none md:px-7 md:hover:scale-[1.03]"
                  style={{ borderColor: encre }}
                >
                  Ajouter · {formatFCFA(prixMin(p))} F
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Visuel en arche */}
        <div className="order-1 flex items-center justify-center gap-6 lg:order-2 xl:gap-10">
          <Fleche sens="gauche" onClick={precedent} encre={encre} fond={p.theme.bg} className="hidden md:grid" />
          <div className="relative aspect-[4/5] w-[58vw] max-w-[460px] overflow-hidden rounded-t-full md:w-[44vw] lg:max-w-[360px] xl:max-w-[420px]" style={{ backgroundColor: p.theme.accent }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={p.slug}
                className="absolute inset-0"
                initial={{ clipPath: sens > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", scale: 1.08 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.4 } }}
                transition={{ duration: 0.6, ease }}
              >
                <Photo id={p.images[0]} alt={`${p.marque} ${p.nom}`} sizes="(max-width: 1024px) 72vw, 460px" priority={index === 0} />
              </motion.div>
            </AnimatePresence>
          </div>
          <Fleche sens="droite" onClick={suivant} encre={encre} fond={p.theme.bg} className="hidden md:grid" />
        </div>
      </div>

      {/* Sélection des parfums */}
      <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-7xl items-center gap-2 px-4 md:bottom-6 md:items-end md:gap-6 md:px-8">
        <Fleche sens="gauche" onClick={precedent} encre={encre} fond={p.theme.bg} petite className="md:hidden" />
        {slides.map((s, i) => (
          <button key={s.slug} onClick={() => aller(i, i >= index ? 1 : -1)} className="group flex-1 text-left" aria-label={`Voir ${s.marque} ${s.nom}`} aria-current={i === index}>
            <span
              className={`hidden truncate text-base font-semibold transition-opacity md:block ${i === index ? "opacity-100" : "opacity-50 group-hover:opacity-90"}`}
            >
              {s.nom}
            </span>
            <span className="relative mt-2 block h-1 overflow-hidden rounded-full" style={{ background: encre + "33" }}>
              {i === index ? (
                <motion.span
                  key={`actif-${index}`}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: encre }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DUREE / 1000, ease: "linear" }}
                />
              ) : null}
            </span>
          </button>
        ))}
        <Fleche sens="droite" onClick={suivant} encre={encre} fond={p.theme.bg} petite className="md:hidden" />
      </div>
    </section>
  );
}

// Flèche ronde et fine : le cercle se remplit et la flèche glisse au survol.
function Fleche({
  sens,
  onClick,
  encre,
  fond,
  petite,
  className = "",
}: {
  sens: "gauche" | "droite";
  onClick: () => void;
  encre: string;
  fond: string;
  petite?: boolean;
  className?: string;
}) {
  const gauche = sens === "gauche";
  return (
    <button
      onClick={onClick}
      aria-label={gauche ? "Parfum précédent" : "Parfum suivant"}
      className={`group relative shrink-0 place-items-center overflow-hidden rounded-full border transition-transform duration-300 active:scale-90 ${
        petite ? "size-11" : "size-16"
      } ${className}`}
      style={{ borderColor: encre + "66", color: encre }}
    >
      <span
        className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100"
        style={{ background: encre }}
        aria-hidden
      />
      <svg
        viewBox="0 0 24 24"
        style={{ ["--fond" as string]: fond }}
        className={`relative transition-all group-hover:text-[var(--fond)] duration-500 ease-out ${petite ? "size-5" : "size-6"} ${
          gauche ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {gauche ? <path d="M19 12H5M11 6l-6 6 6 6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

