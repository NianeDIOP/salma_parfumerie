"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Photo } from "@/components/photo";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";

interface Famille {
  titre: string;
  texte: string;
  produit: Produit;
}

// Trois familles olfactives, chacune sur la couleur de son parfum.
export function ScentFamilies({ familles }: { familles: Famille[] }) {
  return (
    <div>
      {familles.map((f, i) => {
        const p = f.produit;
        const encre = p.theme.dark ? "#fff" : "#1a1a1a";
        return (
          <section key={p.slug} style={{ background: p.theme.bg, color: encre }}>
            <div className={`mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28`}>
              <motion.div
                className={i % 2 ? "md:order-2" : ""}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <h2 className="text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl">{f.titre}</h2>
                <p className="mt-6 max-w-md text-xl leading-snug opacity-85">{f.texte}</p>
                <Link
                  href={`/${p.univers}/${p.slug}`}
                  className="mt-9 inline-flex items-center gap-4 rounded-full py-2 pl-2 pr-7 transition-transform hover:scale-[1.03]"
                  style={{ background: encre, color: p.theme.bg }}
                >
                  <span className="relative size-12 overflow-hidden rounded-full">
                    <Photo id={p.images[0]} alt="" sizes="48px" />
                  </span>
                  <span className="text-left">
                    <span className="block font-bold">
                      {p.marque} {p.nom}
                    </span>
                    <span className="text-sm opacity-80">dès {formatFCFA(prixMin(p))} FCFA</span>
                  </span>
                </Link>
              </motion.div>
              <motion.div
                className={`relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-t-full ${i % 2 ? "md:order-1" : ""}`}
                style={{ background: p.theme.accent }}
                initial={{ clipPath: "inset(30% 10% 30% 10% round 999px)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <Photo id={p.images[0]} alt={`${p.marque} ${p.nom}`} sizes="440px" />
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
