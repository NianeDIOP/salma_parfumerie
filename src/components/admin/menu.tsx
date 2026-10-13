"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { deconnexion } from "@/lib/actions/admin";
import { Icone, type NomIcone } from "./icones";

const groupes: { titre: string; liens: { href: string; label: string; icone: NomIcone; compteur?: "commandes" | "stocks" }[] }[] = [
  { titre: "", liens: [{ href: "/admin", label: "Tableau de bord", icone: "tableau" }] },
  {
    titre: "Ventes",
    liens: [
      { href: "/admin/commandes", label: "Commandes", icone: "commandes", compteur: "commandes" },
      { href: "/admin/commandes/nouvelle", label: "Nouvelle vente", icone: "plus" },
      { href: "/admin/clients", label: "Clients", icone: "clients" },
      { href: "/admin/promotions", label: "Codes promo", icone: "promo" },
    ],
  },
  {
    titre: "Catalogue",
    liens: [
      { href: "/admin/produits", label: "Produits", icone: "produits" },
      { href: "/admin/stocks", label: "Stocks & prix", icone: "stocks", compteur: "stocks" },
      { href: "/admin/univers", label: "Univers", icone: "univers" },
    ],
  },
  {
    titre: "Site public",
    liens: [
      { href: "/admin/accueil", label: "Page d'accueil", icone: "accueil" },
      { href: "/admin/apparence", label: "Apparence", icone: "apparence" },
      { href: "/admin/pages", label: "Pages", icone: "pages" },
      { href: "/admin/livraison", label: "Livraison & paiement", icone: "livraison" },
    ],
  },
  { titre: "Réglages", liens: [{ href: "/admin/parametres", label: "Paramètres", icone: "parametres" }] },
];

export function MenuAdmin({ admin, logo, compteurs }: { admin: { email: string; nom: string }; logo: string; compteurs: { commandes: number; stocks: number } }) {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fermer le menu mobile après navigation
  useEffect(() => setOuvert(false), [pathname]);

  const actif = (href: string) => (href === "/admin" ? pathname === "/admin" : href === "/admin/commandes" ? pathname.startsWith(href) && !pathname.endsWith("/nouvelle") : pathname.startsWith(href));

  const contenu = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex h-14 items-center gap-2 border-b border-line px-4">
        <span className="grid size-7 place-items-center rounded-md bg-bissap text-sm font-extrabold text-white">{logo.charAt(0).toUpperCase()}</span>
        <span className="text-[15px] font-bold tracking-tight">{logo}</span>
        <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">Admin</span>
      </Link>
      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3">
        {groupes.map((g) => (
          <div key={g.titre || "racine"}>
            {g.titre && <p className="px-2.5 pb-1 text-[11px] font-semibold text-muted">{g.titre}</p>}
            <ul className="space-y-px">
              {g.liens.map((l) => {
                const n = l.compteur ? compteurs[l.compteur] : 0;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition ${actif(l.href) ? "bg-ink font-medium text-white" : "text-ink/80 hover:bg-ink/5 hover:text-ink"}`}
                    >
                      <Icone nom={l.icone} className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{l.label}</span>
                      {n > 0 && <span className={`min-w-5 rounded px-1.5 text-center text-[11px] font-semibold leading-[18px] ${l.compteur === "stocks" ? "bg-[#d9a521] text-white" : "bg-bissap text-white"}`}>{n}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-2 border-t border-line p-2.5">
        <a href="/" target="_blank" className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] text-ink/80 hover:bg-ink/5 hover:text-ink">
          <Icone nom="externe" className="size-4" /> Voir le site
        </a>
        <div className="flex items-center gap-2 rounded-lg bg-creme-light p-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-nuit text-[11px] font-bold text-white">{admin.nom.slice(0, 2).toUpperCase()}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">{admin.nom}</span>
            <span className="block truncate text-[11px] text-muted">{admin.email}</span>
          </span>
          <form action={deconnexion}>
            <button className="grid size-7 place-items-center rounded-md text-muted hover:bg-line hover:text-ink" title="Se déconnecter" aria-label="Se déconnecter">
              <Icone nom="sortie" className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-line bg-white lg:block">{contenu}</aside>

      {/* Mobile */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center gap-2 border-b border-line bg-white/95 px-2 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <button onClick={() => setOuvert(true)} className="grid size-9 place-items-center rounded-md hover:bg-ink/5" aria-label="Menu">
          <Icone nom="menu" className="size-5" />
        </button>
        <span className="text-[15px] font-bold tracking-tight">{logo}</span>
        <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">Admin</span>
        {compteurs.commandes > 0 && (
          <Link href="/admin/commandes" className="ml-auto flex h-7 items-center gap-1.5 rounded-md bg-bissap px-2.5 text-xs font-semibold text-white">
            <Icone nom="commandes" className="size-3.5" /> {compteurs.commandes} à traiter
          </Link>
        )}
      </header>
      <div className={`fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden ${ouvert ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOuvert(false)} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${ouvert ? "translate-x-0" : "-translate-x-full"}`}>{contenu}</aside>
    </>
  );
}
