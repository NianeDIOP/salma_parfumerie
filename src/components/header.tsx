"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart";
import { BagIcon, HeartIcon, SearchIcon, SparkIcon, UserIcon } from "./icons";
import { SearchOverlay } from "./search";

const nav = [
  { href: "/parfums", label: "Parfums" },
  { href: "/huiles", label: "Huiles parfumées" },
  { href: "/cosmetiques", label: "Cosmétiques" },
  { href: "/maison", label: "Maison" },
  { href: "/coffrets", label: "Coffrets" },
];

// Titres affichés dans la barre d'application mobile
const titres: Record<string, string> = {
  "/boutique": "Boutique",
  "/favoris": "Favoris",
  "/panier": "Panier",
  "/quiz": "Ma Signature",
  "/compte": "Mon compte",
  "/coffrets": "Coffrets",
  "/parfums": "Parfums",
  "/huiles": "Huiles parfumées",
  "/cosmetiques": "Cosmétiques",
  "/maison": "Maison",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, bump, setOpen } = useCart();
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pulse, setPulse] = useState(false);
  const accueil = pathname === "/";
  const titre = titres[pathname] ?? titres["/" + pathname.split("/")[1]];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Le badge du panier pulse à chaque ajout
  useEffect(() => {
    if (!bump) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- animation déclenchée par l'ajout
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [bump]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    const ouvrir = () => setSearch(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("salma:recherche", ouvrir);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("salma:recherche", ouvrir);
    };
  }, []);

  const badge = count > 0 && (
    <span
      className={`absolute right-0 top-0 grid min-w-[18px] place-items-center rounded-full bg-bissap px-1 text-[11px] font-bold leading-[18px] text-white transition-transform ${
        pulse ? "scale-150" : "scale-100"
      }`}
    >
      {count}
    </span>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
          scrolled ? "border-line bg-creme/95 backdrop-blur-md" : "border-transparent bg-creme"
        }`}
      >
        {/* Barre d'application mobile */}
        <div className="flex h-14 items-center gap-2 px-2 md:hidden">
          {accueil ? (
            <Link href="/" className="flex items-baseline gap-1 px-2" aria-label="SALMA Fragrance, accueil">
              <span className="text-[26px] font-extrabold tracking-tight">salma</span>
              <span className="text-sm text-muted">fragrance</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
                className="grid size-11 place-items-center rounded-full active:bg-line"
                aria-label="Retour"
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <p className="min-w-0 flex-1 truncate text-lg font-bold">{titre ?? <span className="font-extrabold tracking-tight">salma</span>}</p>
            </>
          )}
          <div className="ml-auto flex items-center">
            <button className="grid size-11 place-items-center rounded-full active:bg-line" onClick={() => setSearch(true)} aria-label="Rechercher">
              <SearchIcon className="size-6" />
            </button>
            <button className="relative grid size-11 place-items-center rounded-full active:bg-line" onClick={() => setOpen(true)} aria-label={`Panier (${count})`}>
              <BagIcon className="size-6" />
              {badge}
            </button>
          </div>
        </div>

        {/* En-tête ordinateur */}
        <div className="mx-auto hidden h-[72px] max-w-7xl items-center gap-6 px-8 md:flex">
          <Link href="/" className="flex items-baseline gap-1.5" aria-label="SALMA Fragrance, accueil">
            <span className="text-[28px] font-extrabold tracking-tight">salma</span>
            <span className="text-sm text-muted">fragrance</span>
          </Link>

          <nav className="ml-6 flex items-center gap-7 text-[15px]">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative hidden py-1 transition-colors hover:text-bissap lg:block ${active ? "text-bissap" : ""}`}
                >
                  {item.label}
                  <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-bissap transition-all duration-300 ${active ? "w-full" : "w-0"}`} />
                </Link>
              );
            })}
            <Link href="/boutique" className="py-1 transition-colors hover:text-bissap lg:hidden">
              Boutique
            </Link>
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 rounded-full bg-rose px-4 py-1.5 font-medium text-bissap transition hover:bg-bissap hover:text-white"
            >
              <SparkIcon className="size-4" />
              Ma Signature
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button className="grid size-11 place-items-center rounded-full transition hover:bg-line" onClick={() => setSearch(true)} aria-label="Rechercher">
              <SearchIcon />
            </button>
            <Link href="/compte" className="grid size-11 place-items-center rounded-full transition hover:bg-line" aria-label="Mon compte">
              <UserIcon />
            </Link>
            <Link href="/favoris" className="grid size-11 place-items-center rounded-full transition hover:bg-line" aria-label="Mes favoris">
              <HeartIcon />
            </Link>
            <button className="relative grid size-11 place-items-center rounded-full transition hover:bg-line" onClick={() => setOpen(true)} aria-label={`Panier (${count})`}>
              <BagIcon />
              {badge}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
