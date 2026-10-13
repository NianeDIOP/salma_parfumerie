"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatFCFA, getProduit, LIVRAISON_OFFERTE_DES } from "@/lib/catalogue";
import { Bottle } from "./bottle";
import { prixLigne, useCart } from "./cart";
import { CloseIcon } from "./icons";

export function CartDrawer() {
  const { lines, open, setOpen, total, update } = useCart();
  const reste = Math.max(0, LIVRAISON_OFFERTE_DES - total);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-creme transition-all duration-500 ease-out ${
          open ? "translate-x-0 shadow-2xl" : "invisible translate-x-full"
        }`}
        aria-label="Panier"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-xl font-bold">Votre panier</h2>
          <button onClick={() => setOpen(false)} aria-label="Fermer le panier">
            <CloseIcon />
          </button>
        </div>

        {lines.length > 0 && (
          <div className="border-b border-line px-6 py-4">
            <p className="text-sm">
              {reste > 0 ? (
                <>
                  Plus que <strong>{formatFCFA(reste)} FCFA</strong> pour la livraison offerte à Dakar
                </>
              ) : (
                <strong className="text-sauge">Livraison offerte à Dakar !</strong>
              )}
            </p>
            <div className="mt-2 h-1 bg-line">
              <div
                className="h-full bg-bissap transition-all duration-700"
                style={{ width: `${Math.min(100, (total / LIVRAISON_OFFERTE_DES) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-lg font-semibold">Votre panier est vide</p>
                <p className="mt-1 text-sm text-muted">Laissez-vous guider par nos univers olfactifs.</p>
                <Link
                  href="/quiz"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-block bg-ink px-6 py-3 text-sm text-white"
                >
                  Trouver ma signature
                </Link>
              </div>
            </div>
          )}
          <ul className="divide-y divide-line">
            {lines.map((l) => {
              const p = getProduit(l.slug);
              if (!p) return null;
              return (
                <li key={`${l.slug}-${l.contenance}`} className="flex gap-4 py-4">
                  <div className="grid size-20 shrink-0 place-items-center" style={{ background: p.visuel.fond }}>
                    <Bottle {...p.visuel} className="h-16" label={false} shadow={false} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-bold">{p.nom}</p>
                        <p className="text-xs text-muted">
                          {p.type} · {l.contenance}
                        </p>
                      </div>
                      <p className="font-mono text-sm">{formatFCFA(prixLigne(l))}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button className="px-3 py-1" onClick={() => update(l.slug, l.contenance, l.quantite - 1)} aria-label="Retirer un">
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{l.quantite}</span>
                        <button className="px-3 py-1" onClick={() => update(l.slug, l.contenance, l.quantite + 1)} aria-label="Ajouter un">
                          +
                        </button>
                      </div>
                      <button className="text-xs text-muted underline" onClick={() => update(l.slug, l.contenance, 0)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex justify-between text-lg font-bold">
              <span>Sous-total</span>
              <span>{formatFCFA(total)} FCFA</span>
            </div>
            <p className="mt-1 text-xs text-muted">Échantillon offert au choix à l&apos;étape suivante.</p>
            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="mt-4 block bg-bissap py-4 text-center font-semibold text-white transition hover:bg-bissap-dark"
            >
              Commander
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
