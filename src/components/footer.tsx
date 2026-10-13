"use client";

import Link from "next/link";
import { useSite } from "./site-provider";

export function Footer() {
  const { reglages } = useSite();
  const { pied, identite } = reglages;

  return (
    <footer className="mt-16 overflow-hidden bg-ink text-white md:mt-32">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_repeat(3,1fr)] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-4xl font-extrabold tracking-tight">{identite.logo}</p>
            <p className="mt-4 max-w-xs text-sm text-white/60">{pied.description}</p>
            {pied.newsletter.visible && (
              <form className="mt-8 flex max-w-sm border-b border-white/40">
                <input type="tel" placeholder={pied.newsletter.placeholder} className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40" />
                <button type="button" className="shrink-0 text-sm font-semibold text-rose">
                  {pied.newsletter.bouton}
                </button>
              </form>
            )}
          </div>

          {pied.colonnes.map((col, i) => (
            <div key={col.titre + i} className={i === pied.colonnes.length - 1 && pied.colonnes.length % 2 ? "col-span-2 md:col-span-1" : ""}>
              <p className="text-lg font-bold">{col.titre}</p>
              <ul className="mt-4 space-y-3 text-base md:space-y-2 md:text-sm">
                {col.liens.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {pied.grandLogo && (
          <p
            className="mt-12 select-none bg-gradient-to-b from-white/90 to-white/5 bg-clip-text text-center text-[27vw] font-extrabold leading-[0.8] tracking-tighter text-transparent md:mt-20 md:text-[22vw]"
            aria-hidden
          >
            {identite.logo}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {pied.paiements.map((p) => (
              <span key={p} className="border border-white/20 px-3 py-1 text-sm text-white/70">
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/40">{pied.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
