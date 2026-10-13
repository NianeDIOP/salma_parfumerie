"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { univers } from "@/lib/catalogue";
import { useCart } from "./cart";

const slugsUnivers = univers.map((u) => u.slug as string);

// Pages où une barre d'action propre remplace les onglets (fiche produit, commande, quiz)
function sansOnglets(pathname: string) {
  const seg = pathname.split("/").filter(Boolean);
  return (seg.length === 2 && slugsUnivers.includes(seg[0])) || pathname === "/panier" || pathname === "/quiz";
}

const Icone = ({ d, plein }: { d: string; plein?: boolean }) => (
  <svg viewBox="0 0 24 24" className="size-6" fill={plein ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const ICONES = {
  accueil: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  boutique: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  favoris: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  panier: "M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2",
};

// Barre d'onglets façon application, visible uniquement sur mobile.
export function BottomNav() {
  const pathname = usePathname();
  const { count, favoris, setOpen } = useCart();
  if (sansOnglets(pathname)) return null;

  const actif = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/boutique" && slugsUnivers.some((s) => pathname.startsWith(`/${s}`))));

  const onglet = (href: string, label: string, d: string, extra?: React.ReactNode) => {
    const on = actif(href);
    return (
      <Link href={href} className={`relative flex flex-1 flex-col items-center gap-0.5 pt-2 text-[11px] font-medium ${on ? "text-bissap" : "text-ink/60"}`}>
        <Icone d={d} plein={on && href !== "/boutique"} />
        {label}
        {extra}
      </Link>
    );
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-creme/95 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      aria-label="Navigation principale"
    >
      {onglet("/", "Accueil", ICONES.accueil)}
      {onglet("/boutique", "Boutique", ICONES.boutique)}
      <Link href="/quiz" className="flex flex-1 flex-col items-center" aria-label="Quiz Ma Signature">
        <span className="-mt-5 grid size-14 place-items-center rounded-full bg-bissap text-white shadow-lg shadow-bissap/30 ring-4 ring-creme">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
          </svg>
        </span>
        <span className="mt-0.5 text-[11px] font-medium text-ink/60">Signature</span>
      </Link>
      {onglet(
        "/favoris",
        "Favoris",
        ICONES.favoris,
        favoris.length > 0 && <span className="absolute right-[calc(50%-18px)] top-1.5 size-2 rounded-full bg-bissap" />,
      )}
      <button onClick={() => setOpen(true)} className="relative flex flex-1 flex-col items-center gap-0.5 pt-2 text-[11px] font-medium text-ink/60">
        <Icone d={ICONES.panier} />
        Panier
        {count > 0 && (
          <span className="absolute right-[calc(50%-22px)] top-1 grid min-w-[18px] place-items-center rounded-full bg-bissap px-1 text-[11px] font-bold leading-[18px] text-white">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}
