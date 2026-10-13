"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Photo } from "@/components/photo";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";

interface Etape {
  famille: string;
  titre: string;
  texte: string;
  produit: Produit;
}

// Voyage olfactif : la scène reste fixe, la couleur, l'image et le texte changent au fil du scroll.
export function ScentJourney({ etapes }: { etapes: Etape[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [actif, setActif] = useState(0);

  const couleurs = etapes.map((e) => e.produit.theme.bg);
  const bornes = etapes.map((_, i) => i / (etapes.length - 1));
  const bg = useTransform(scrollYProgress, bornes, couleurs);
  const rotation = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const echelle = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.02, 0.92]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActif(Math.min(etapes.length - 1, Math.floor(v * etapes.length)));
  });

  const e = etapes[actif];
  const encre = e.produit.theme.dark ? "#fff" : "#1a1a1a";

  return (
    <motion.section ref={ref} className="relative" style={{ height: `${etapes.length * 100}vh`, backgroundColor: bg }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          <motion.div animate={{ color: encre }} transition={{ duration: 0.6 }}>
            <p className="font-mono text-xs uppercase tracking-[0.25em] opacity-70">Votre famille olfactive</p>
            <div className="mt-6 flex gap-3">
              {etapes.map((x, i) => (
                <span key={x.famille} className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: encre + "33" }}>
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ background: encre }}
                    animate={{ width: i <= actif ? "100%" : "0%" }}
                    transition={{ duration: 0.6 }}
                  />
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={actif}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.1, 1] }}
              >
                <p className="mt-10 font-mono text-sm opacity-70">0{actif + 1} — {e.famille}</p>
                <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl">{e.titre}</h2>
                <p className="mt-6 max-w-md text-lg opacity-80">{e.texte}</p>
                <Link
                  href={`/${e.produit.univers}/${e.produit.slug}`}
                  className="mt-8 inline-flex items-center gap-4 rounded-full py-2 pl-2 pr-6"
                  style={{ background: encre + "18" }}
                >
                  <span className="relative size-12 overflow-hidden rounded-full">
                    <Photo id={e.produit.images[0]} alt="" sizes="48px" />
                  </span>
                  <span className="text-left text-sm">
                    <span className="block font-bold">
                      {e.produit.marque} {e.produit.nom}
                    </span>
                    <span className="font-mono text-xs opacity-70">dès {formatFCFA(prixMin(e.produit))} FCFA</span>
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]" style={{ rotate: rotation, scale: echelle }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={actif}
                className="absolute inset-0 overflow-hidden rounded-[999px_999px_24px_24px] shadow-2xl"
                initial={{ clipPath: "circle(0% at 50% 50%)" }}
                animate={{ clipPath: "circle(75% at 50% 50%)" }}
                exit={{ opacity: 0, transition: { delay: 0.5 } }}
                transition={{ duration: 1, ease: [0.7, 0, 0.2, 1] }}
                style={{ background: e.produit.theme.accent }}
              >
                <Photo id={e.produit.images[0]} alt={`${e.produit.marque} ${e.produit.nom}`} sizes="460px" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
