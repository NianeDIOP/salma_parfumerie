"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { Produit, Univers } from "@/lib/catalogue";
import { StarIcon } from "./icons";
import { SplitText } from "./motion/split-text";
import { Photo } from "./photo";
import { ProductBuy } from "./product-buy";

// Fiche produit immersive : toute la scène prend la couleur du parfum.
export function ProductHero({ produit: p, univers: u }: { produit: Produit; univers: Univers }) {
  const ref = useRef<HTMLElement>(null);
  const [vue, setVue] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const xTexte = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const encre = p.theme.dark ? "#fff" : "#1a1a1a";

  return (
    <section ref={ref} className="relative isolate overflow-hidden" style={{ background: p.theme.bg, color: encre }}>
      <motion.p
        className="pointer-events-none absolute -bottom-[0.15em] left-0 z-0 select-none whitespace-nowrap text-[24vw] font-extrabold leading-none tracking-tighter"
        style={{ x: xTexte, WebkitTextStroke: `1px ${encre}`, color: "transparent", opacity: 0.18 }}
        aria-hidden
      >
        {p.marque} · {p.nom}
      </motion.p>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 pb-14 pt-4 md:gap-10 md:px-8 md:pb-20 md:pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Galerie */}
        <div>
          <motion.div
            className="relative mx-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-[999px] md:w-full"
            style={{ background: p.theme.accent }}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, ease: [0.7, 0, 0.2, 1], delay: 0.2 }}
            data-cursor="voir"
          >
            <motion.div className="absolute inset-[-10%]" style={{ y: yImage }}>
              {p.images.map((img, i) => (
                <motion.div
                  key={img}
                  className="absolute inset-0"
                  animate={{ opacity: vue === i ? 1 : 0, scale: vue === i ? 1 : 1.08 }}
                  transition={{ duration: 0.9 }}
                >
                  <Photo id={img} alt={`${p.marque} ${p.nom}`} sizes="(max-width: 1024px) 100vw, 55vw" priority={i === 0} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          {p.images.length > 1 && (
            <div className="mt-4 flex justify-center gap-3 md:justify-start">
              {p.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setVue(i)}
                  className={`relative size-14 overflow-hidden rounded-full md:size-20 ring-2 ring-offset-2 transition ${vue === i ? "" : "opacity-60 ring-transparent"}`}
                  style={{ ["--tw-ring-color" as string]: vue === i ? encre : "transparent", ["--tw-ring-offset-color" as string]: p.theme.bg }}
                  aria-label={`Vue ${i + 1}`}
                >
                  <Photo id={img} alt="" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.p
            className="flex items-center gap-2 text-sm opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 0.3 }}
          >
            <Link href={`/${u.slug}`} className="hover:underline">
              {u.nom}
            </Link>
            <span>›</span> {p.famille}
            {p.badge && (
              <span className="ml-2 rounded-full px-3 py-0.5 text-xs font-semibold" style={{ background: encre, color: p.theme.bg }}>
                {p.badge}
              </span>
            )}
          </motion.p>
          <p className="mt-4 text-xl font-semibold md:mt-6 md:text-2xl" style={{ color: p.theme.accent }}>
            {p.marque}
          </p>
          <h1 className="mt-1 text-[44px] font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
            <SplitText text={p.nom} delay={0.3} />
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
            <p className="mt-3 text-lg opacity-80">
              {p.type} · {p.genre}
            </p>
            <p className="mt-3 flex items-center gap-1 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className={`size-3.5 ${i < Math.round(p.note) ? "" : "opacity-30"}`} />
              ))}
              <span className="ml-1 opacity-75">
                {p.note} · {p.avis} avis vérifiés
              </span>
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed opacity-90 md:mt-6 md:text-lg">{p.description}</p>
          </motion.div>

          <motion.div
            className="mt-6 rounded-3xl bg-creme p-5 text-ink shadow-2xl md:mt-8 md:p-7"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
          >
            <ProductBuy produit={p} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
