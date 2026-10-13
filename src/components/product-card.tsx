"use client";

import Link from "next/link";
import { formatFCFA, prixMin, type Produit } from "@/lib/catalogue";
import { Bottle } from "./bottle";
import { useCart } from "./cart";
import { BagIcon, HeartIcon, StarIcon } from "./icons";

export function ProductCard({ produit: p }: { produit: Produit }) {
  const { add } = useCart();
  const premiere = p.contenances.find((c) => c.stock > 0) ?? p.contenances[0];

  return (
    <article className="group flex flex-col">
      <Link
        href={`/${p.univers}/${p.slug}`}
        className="relative block aspect-[4/5] overflow-hidden"
        style={{ background: p.visuel.fond }}
      >
        {p.badge && (
          <span className="absolute left-3 top-3 z-10 bg-white px-2 py-1 text-[11px] font-semibold text-bissap">
            {p.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-white/70 opacity-0 transition group-hover:opacity-100">
          <HeartIcon className="size-4" />
        </span>
        <div className="absolute inset-0 grid place-items-center p-8 transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:rotate-[-4deg] group-hover:scale-105">
          <Bottle {...p.visuel} className="h-full max-h-56 w-auto drop-shadow-xl" />
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] text-muted">
            {p.type} · {p.famille}
          </p>
          <Link href={`/${p.univers}/${p.slug}`} className="font-bold leading-tight hover:text-bissap">
            {p.nom}
          </Link>
        </div>
        <span className="flex items-center gap-0.5 text-[11px] text-ink">
          <StarIcon className="size-3 text-bissap" />
          {p.note}
        </span>
      </div>
      <p className="mt-1 font-mono text-sm">
        {p.contenances.length > 1 && <span className="text-muted">dès </span>}
        {formatFCFA(prixMin(p))} <span className="text-[10px] text-muted">FCFA</span>
      </p>
      <button
        onClick={() => add(p.slug, premiere.label)}
        className="mt-3 flex items-center justify-center gap-2 bg-ink py-2.5 text-sm text-white transition hover:bg-bissap"
      >
        <BagIcon className="size-4" /> Ajouter
      </button>
    </article>
  );
}
