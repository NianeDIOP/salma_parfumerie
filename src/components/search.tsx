"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatFCFA, prixMin } from "@/lib/catalogue";
import { rechercher, suggestions } from "@/lib/search";
import { Photo } from "./photo";
import { useSite } from "./site-provider";
import { CloseIcon, SearchIcon } from "./icons";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const { produits } = useSite();
  const resultats = useMemo(() => rechercher(produits, q), [produits, q]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-creme transition-all duration-500 ${
        open ? "opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Recherche"
      aria-hidden={!open}
    >
      <div className="mx-auto max-w-4xl px-4 pt-6 md:px-8 md:pt-12">
        <div className="flex items-center gap-4 border-b-2 border-ink pb-3">
          <SearchIcon className="size-6 shrink-0" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un parfum, une note…"
            className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-muted/60 md:text-4xl"
          />
          <button onClick={onClose} aria-label="Fermer la recherche">
            <CloseIcon />
          </button>
        </div>

        {!q && (
          <div className="mt-8">
            <p className="text-lg font-semibold">Recherches populaires</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="border border-line px-4 py-2 text-sm transition hover:border-ink">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {q && (
          <div className="mt-6 max-h-[70vh] overflow-y-auto">
            <p className="mb-4 text-sm text-muted">
              {resultats.length} résultat{resultats.length > 1 ? "s" : ""}
            </p>
            {resultats.length === 0 && (
              <p className="text-muted">Aucune fragrance ne correspond. Essayez une note : oud, rose, vanille…</p>
            )}
            <ul className="grid gap-3 sm:grid-cols-2">
              {resultats.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.univers}/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 bg-creme-light p-3 transition hover:bg-white"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden" style={{ background: p.theme.bg }}>
                      <Photo id={p.images[0]} alt="" sizes="64px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted">
                        {p.type} · {p.famille}
                      </p>
                      <p className="font-bold">
                        {p.marque} {p.nom}
                      </p>
                      <p className="text-sm">dès {formatFCFA(prixMin(p))} FCFA</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
