"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";
import { useCart } from "./cart";
import { HeartIcon, StarIcon } from "./icons";
import { Photo } from "./photo";

export function ProductCard({ produit: p, index = 0 }: { produit: Produit; index?: number }) {
  const { add } = useCart();
  const premiere = p.contenances.find((c) => c.stock > 0) ?? p.contenances[0];
  const encre = p.theme.dark ? "#fff" : "#1a1a1a";

  return (
    <motion.article
      className="group flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]" style={{ background: p.theme.bg }} data-cursor="voir">
        <Link href={`/${p.univers}/${p.slug}`} className="absolute inset-0" aria-label={`${p.marque} ${p.nom}`}>
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <Photo id={p.images[0]} alt={`${p.marque} ${p.nom}`} sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
          {p.images[1] && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <Photo id={p.images[1]} alt="" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          )}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: `linear-gradient(to top, ${p.theme.bg}ee 0%, transparent 45%)` }}
          />
        </Link>

        {p.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: p.theme.bg, color: encre }}
          >
            {p.badge}
          </span>
        )}
        <button
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white text-ink opacity-0 transition duration-500 hover:scale-110 group-hover:opacity-100"
          aria-label="Ajouter aux favoris"
        >
          <HeartIcon className="size-4" />
        </button>

        {/* Ajout rapide qui glisse depuis le bas */}
        <button
          onClick={() => add(p.slug, premiere.label)}
          className="absolute inset-x-3 bottom-3 z-10 translate-y-[140%] rounded-full py-3 text-sm font-semibold transition-transform duration-500 ease-[cubic-bezier(.2,.7,.1,1)] group-hover:translate-y-0 max-md:translate-y-0 max-md:py-2 max-md:text-xs"
          style={{ background: encre, color: p.theme.bg }}
        >
          Ajouter · {premiere.label}
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-bissap">{p.marque}</p>
          <Link href={`/${p.univers}/${p.slug}`} className="mt-1 block text-lg font-bold leading-tight tracking-tight hover:text-bissap">
            {p.nom}
          </Link>
          <p className="text-sm text-muted">
            {p.type} · {p.famille}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-semibold tabular-nums">
            {formatFCFA(prixMin(p))} F
          </p>
          <p className="mt-1 flex items-center justify-end gap-0.5 text-sm">
            <StarIcon className="size-3 text-bissap" /> {p.note}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
