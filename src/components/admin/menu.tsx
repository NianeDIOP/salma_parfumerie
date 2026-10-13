"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { deconnexion } from "@/lib/actions/admin";

const groupes: { titre: string; liens: { href: string; label: string; icone: string; compteur?: "commandes" | "stocks" }[] }[] = [
  { titre: "", liens: [{ href: "/admin", label: "Tableau de bord", icone: "M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z" }] },
  {
    titre: "Ventes",
    liens: [
      { href: "/admin/commandes", label: "Commandes", icone: "M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2", compteur: "commandes" },
      { href: "/admin/commandes/nouvelle", label: "Nouvelle vente", icone: "M12 5v14M5 12h14" },
      { href: "/admin/clients", label: "Clients", icone: "M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" },
      { href: "/admin/promotions", label: "Codes promo", icone: "M20 12l-8 8-9-9V3h8zM7.5 7.5h.01" },
    ],
  },
  {
    titre: "Catalogue",
    liens: [
      { href: "/admin/produits", label: "Produits", icone: "M8 3h8v4l2 2v12H6V9l2-2z" },
      { href: "/admin/stocks", label: "Stocks & prix", icone: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10", compteur: "stocks" },
      { href: "/admin/univers", label: "Univers", icone: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
    ],
  },
  {
    titre: "Site public",
    liens: [
      { href: "/admin/accueil", label: "Page d'accueil", icone: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
      { href: "/admin/apparence", label: "Apparence", icone: "M12 3a9 9 0 1 0 0 18c1 0 2-1 1.5-2-.6-1.4.4-3 2-3H18a3 3 0 0 0 3-3 9 9 0 0 0-9-10zM7.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
      { href: "/admin/pages", label: "Pages", icone: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6" },
      { href: "/admin/livraison", label: "Livraison & paiement", icone: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
    ],
  },
  { titre: "Réglages", liens: [{ href: "/admin/parametres", label: "Paramètres", icone: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" }] },
];

export function MenuAdmin({ admin, logo, compteurs }: { admin: { email: string; nom: string }; logo: string; compteurs: { commandes: number; stocks: number } }) {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fermer le menu mobile après navigation
  useEffect(() => setOuvert(false), [pathname]);

  const actif = (href: string) => (href === "/admin" ? pathname === "/admin" : href === "/admin/commandes" ? pathname.startsWith(href) && !pathname.endsWith("/nouvelle") : pathname.startsWith(href));

  const contenu = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-baseline gap-1.5 px-5 pb-6 pt-6">
        <span className="text-2xl font-extrabold tracking-tight">{logo}</span>
        <span className="text-sm text-muted">gestion</span>
      </Link>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3">
        {groupes.map((g) => (
          <div key={g.titre || "racine"}>
            {g.titre && <p className="px-3 pb-1.5 text-sm font-semibold text-muted">{g.titre}</p>}
            <ul className="space-y-0.5">
              {g.liens.map((l) => {
                const n = l.compteur ? compteurs[l.compteur] : 0;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition ${actif(l.href) ? "bg-ink font-semibold text-white" : "hover:bg-line/60"}`}
                    >
                      <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={l.icone} />
                      </svg>
                      <span className="flex-1">{l.label}</span>
                      {n > 0 && <span className={`rounded-full px-2 text-xs font-bold leading-5 ${l.compteur === "stocks" ? "bg-[#d9a521] text-white" : "bg-bissap text-white"}`}>{n}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <a href="/" target="_blank" className="mb-3 flex items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm font-semibold hover:border-ink">
          Voir le site ↗
        </a>
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-nuit text-sm font-bold text-white">{admin.nom.slice(0, 2).toUpperCase()}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{admin.nom}</span>
            <span className="block truncate text-xs text-muted">{admin.email}</span>
          </span>
          <form action={deconnexion}>
            <button className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-line hover:text-ink" title="Se déconnecter">
              Quitter
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">{contenu}</aside>

      {/* Mobile */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-white/95 px-3 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <button onClick={() => setOuvert(true)} className="grid size-10 place-items-center rounded-full hover:bg-line" aria-label="Menu">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <span className="text-xl font-extrabold tracking-tight">{logo}</span>
        <span className="text-sm text-muted">gestion</span>
        {compteurs.commandes > 0 && (
          <Link href="/admin/commandes" className="ml-auto rounded-full bg-bissap px-3 py-1 text-sm font-bold text-white">
            {compteurs.commandes} à traiter
          </Link>
        )}
      </header>
      <div className={`fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden ${ouvert ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOuvert(false)} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${ouvert ? "translate-x-0" : "-translate-x-full"}`}>{contenu}</aside>
    </>
  );
}
