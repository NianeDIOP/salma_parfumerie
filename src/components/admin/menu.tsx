"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  {
    titre: "Réglages",
    liens: [
      { href: "/admin/theme", label: "Thème de l'admin", icone: "couleur" },
      { href: "/admin/parametres", label: "Paramètres", icone: "parametres" },
    ],
  },
];

export function MenuAdmin({ admin, logo, compteurs }: { admin: { email: string; nom: string }; logo: string; compteurs: { commandes: number; stocks: number } }) {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fermer le menu mobile après navigation
  useEffect(() => setOuvert(false), [pathname]);

  const actif = (href: string) => (href === "/admin" ? pathname === "/admin" : href === "/admin/commandes" ? pathname.startsWith(href) && !pathname.endsWith("/nouvelle") : pathname.startsWith(href));

  const contenu = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex h-12 shrink-0 items-center gap-2 border-b border-current/10 px-4">
        <span className="grid size-7 place-items-center rounded-md bg-[var(--a-barre-actif)] text-sm font-extrabold text-[var(--a-barre-actif-texte)]">{logo.charAt(0).toUpperCase()}</span>
        <span className="text-[15px] font-bold tracking-tight">{logo}</span>
        <span className="rounded bg-current/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase opacity-70">Admin</span>
      </Link>
      <nav className="defil-discret flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-2.5 py-3">
        {groupes.map((g) => (
          <div key={g.titre || "racine"}>
            {g.titre && <p className="px-2.5 pb-1 text-[11px] font-semibold opacity-55">{g.titre}</p>}
            <ul className="space-y-px">
              {g.liens.map((l) => {
                const n = l.compteur ? compteurs[l.compteur] : 0;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`flex h-[30px] items-center gap-2.5 rounded-md px-2.5 text-[13px] transition ${actif(l.href) ? "bg-[var(--a-barre-actif)] font-medium text-[var(--a-barre-actif-texte)]" : "opacity-85 hover:bg-current/10 hover:opacity-100"}`}
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
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-line bg-[var(--a-barre)] text-[var(--a-barre-texte)] lg:block">{contenu}</aside>

      {/* Barre du haut (mobile et ordinateur) */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center gap-1.5 border-b border-line bg-white/95 px-2 pt-[env(safe-area-inset-top)] backdrop-blur md:px-4 lg:left-56">
        <button onClick={() => setOuvert(true)} className="grid size-9 place-items-center rounded-md hover:bg-ink/5 lg:hidden" aria-label="Menu">
          <Icone nom="menu" className="size-5" />
        </button>
        <Link href="/admin" className="text-[15px] font-bold tracking-tight lg:hidden">
          {logo}
        </Link>
        <span className="ml-auto" />
        {compteurs.commandes > 0 && (
          <Link href="/admin/commandes" className="flex h-7 items-center gap-1.5 rounded-md bg-bissap px-2.5 text-xs font-semibold text-white" title="Commandes à traiter">
            <Icone nom="commandes" className="size-3.5" /> {compteurs.commandes}
            <span className="hidden sm:inline">à traiter</span>
          </Link>
        )}
        {compteurs.stocks > 0 && (
          <Link href="/admin/stocks" className="hidden h-7 items-center gap-1.5 rounded-md bg-[#d9a521]/15 px-2.5 text-xs font-semibold text-[#a07a10] sm:flex" title="Alertes stock">
            <Icone nom="alerte" className="size-3.5" /> {compteurs.stocks}
          </Link>
        )}
        <a href="/" target="_blank" className="grid size-8 place-items-center rounded-md text-muted hover:bg-ink/5 hover:text-ink" title="Voir le site" aria-label="Voir le site">
          <Icone nom="externe" className="size-4" />
        </a>
        <MenuCompte admin={admin} />
      </header>

      <div className={`fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden ${ouvert ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOuvert(false)} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--a-barre)] text-[var(--a-barre-texte)] shadow-2xl transition-transform duration-300 lg:hidden ${ouvert ? "translate-x-0" : "-translate-x-full"}`}>{contenu}</aside>
    </>
  );
}

function MenuCompte({ admin }: { admin: { email: string; nom: string } }) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fermer après navigation
  useEffect(() => setOuvert(false), [pathname]);
  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOuvert(false);
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("mousedown", fermer);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("mousedown", fermer);
      document.removeEventListener("keydown", echap);
    };
  }, [ouvert]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOuvert((o) => !o)} className="flex h-8 items-center gap-1.5 rounded-md pl-1 pr-1.5 hover:bg-ink/5" aria-label="Mon compte" aria-expanded={ouvert}>
        <span className="grid size-6 place-items-center rounded-md bg-[var(--a-bouton)] text-[10px] font-bold text-[var(--a-bouton-texte)]">{admin.nom.slice(0, 2).toUpperCase()}</span>
        <span className="hidden max-w-32 truncate text-xs font-medium md:block">{admin.nom}</span>
        <Icone nom="bas" className="size-3.5 text-muted" />
      </button>
      {ouvert && (
        <div className="absolute right-0 top-full mt-1.5 w-56 overflow-hidden rounded-lg border border-line bg-white py-1 text-[13px] shadow-xl">
          <div className="border-b border-line px-3 py-2">
            <p className="truncate text-xs font-semibold">{admin.nom}</p>
            <p className="truncate text-[11px] text-muted">{admin.email}</p>
          </div>
          <Link href="/admin/parametres#securite" className="flex h-8 items-center gap-2 px-3 hover:bg-creme">
            <Icone nom="cadenas" className="size-4 text-muted" /> Mot de passe
          </Link>
          <Link href="/admin/theme" className="flex h-8 items-center gap-2 px-3 hover:bg-creme">
            <Icone nom="couleur" className="size-4 text-muted" /> Thème de l&apos;admin
          </Link>
          <form action={deconnexion} className="border-t border-line pt-1">
            <button className="flex h-8 w-full items-center gap-2 px-3 text-bissap hover:bg-creme" aria-label="Se déconnecter">
              <Icone nom="sortie" className="size-4" /> Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
