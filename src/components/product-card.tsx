"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";
import { useCart } from "./cart";
import { StarIcon } from "./icons";
import { Photo } from "./photo";

export function ProductCard({ produit: p, index = 0, className = "" }: { produit: Produit; index?: number; className?: string }) {
  const { add, favoris, toggleFavori } = useCart();
  const premiere = p.contenances.find((c) => c.stock > 0) ?? p.contenances[0];
  const encre = p.theme.dark ? "#fff" : "#1a1a1a";
  const favori = favoris.includes(p.slug);

  return (
    <motion.article
      className={`group flex flex-col ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-md" style={{ background: p.theme.bg }} data-cursor="voir">
        <Link href={`/${p.univers}/${p.slug}`} className="absolute inset-0" aria-label={`${p.marque} ${p.nom}`}>
          <div className="absolute inset-0 transition-transform duration-700 ease-out md:group-hover:scale-105">
            <Photo id={p.images[0]} alt={`${p.marque} ${p.nom}`} sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
          {p.images[1] && (
            <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:block">
              <Photo id={p.images[1]} alt="" sizes="25vw" />
            </div>
          )}
        </Link>

        {p.badge && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-xs font-semibold md:left-3 md:top-3" style={{ background: p.theme.bg, color: encre }}>
            {p.badge}
          </span>
        )}
        <button
          onClick={() => toggleFavori(p.slug)}
          className={`absolute right-2 top-2 z-10 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm transition active:scale-90 md:right-3 md:top-3 md:opacity-0 md:group-hover:opacity-100 ${
            favori ? "text-bissap md:opacity-100" : "text-ink"
          }`}
          aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={favori}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill={favori ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>

        {/* Mobile : bouton « + » toujours visible */}
        <button
          onClick={() => add(p.slug, premiere.label)}
          className="absolute bottom-2 right-2 z-10 grid size-11 place-items-center rounded-full text-2xl font-light shadow-lg transition active:scale-90 md:hidden"
          style={{ background: encre, color: p.theme.bg }}
          aria-label={`Ajouter ${p.nom} au panier`}
        >
          +
        </button>

        {/* Ordinateur : ajout rapide qui glisse depuis le bas */}
        <button
          onClick={() => add(p.slug, premiere.label)}
          className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-[140%] rounded-full py-3 text-sm font-semibold transition-transform duration-500 ease-out group-hover:translate-y-0 md:block"
          style={{ background: encre, color: p.theme.bg }}
        >
          Ajouter · {premiere.label}
        </button>
      </div>

      <Link href={`/${p.univers}/${p.slug}`} className="mt-3 block min-w-0">
        <p className="truncate text-sm font-semibold text-bissap">{p.marque}</p>
        <p className="truncate text-base font-bold leading-tight tracking-tight md:text-lg">{p.nom}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-base font-semibold tabular-nums">{formatFCFA(prixMin(p))} F</p>
          <p className="flex items-center gap-0.5 text-sm text-muted">
            <StarIcon className="size-3.5 text-bissap" /> {p.note}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

// Rangée défilante au doigt (mobile) qui devient une grille sur grand écran.
export function ProductRail({ produits }: { produits: Produit[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 lg:grid-cols-4">
      {produits.map((p, i) => (
        <ProductCard key={p.slug} produit={p} index={i} className="w-[44vw] shrink-0 snap-start md:w-auto" />
      ))}
    </div>
  );
}
