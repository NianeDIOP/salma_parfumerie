"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart";
import { SearchOverlay } from "./search";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, SparkIcon, UserIcon } from "./icons";

const nav = [
  { href: "/parfums", label: "Parfums" },
  { href: "/huiles", label: "Huiles parfumées" },
  { href: "/cosmetiques", label: "Cosmétiques" },
  { href: "/maison", label: "Maison" },
  { href: "/coffrets", label: "Coffrets" },
];

const messages = [
  "Livraison offerte à Dakar dès 30 000 FCFA",
  "Payez avec Wave, Orange Money, Free Money ou par carte",
  "Un échantillon offert dans chaque commande",
  "Livré en 24 h à Dakar pour toute commande avant 15 h",
];

export function AnnouncementBar() {
  const items = [...messages, ...messages];
  return (
    <div className="overflow-hidden bg-nuit py-2 text-[11px] tracking-wide text-white/90">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-12">
            {m}
            <span className="text-bissap">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count, bump, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Le badge du panier pulse à chaque ajout (« panier animé »)
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          scrolled ? "border-line bg-creme/90 backdrop-blur-md" : "border-transparent bg-creme"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
          <button className="-ml-1 p-1 lg:hidden" onClick={() => setMenu(true)} aria-label="Ouvrir le menu">
            <MenuIcon />
          </button>

          <Link href="/" className="flex items-baseline gap-1.5" aria-label="SALMA Fragrance, accueil">
            <span className="text-2xl font-extrabold tracking-tight">salma</span>
            <span className="font-mono text-[10px] text-muted">fragrance</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-7 text-sm lg:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 transition-colors hover:text-bissap ${active ? "text-bissap" : ""}`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-bissap transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 rounded-full bg-rose px-3 py-1 text-bissap transition hover:bg-bissap hover:text-white"
            >
              <SparkIcon className="size-3.5" />
              Ma Signature
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 md:gap-3">
            <button className="p-2 transition hover:text-bissap" onClick={() => setSearch(true)} aria-label="Rechercher">
              <SearchIcon />
            </button>
            <Link href="/compte" className="hidden p-2 transition hover:text-bissap sm:block" aria-label="Mon compte">
              <UserIcon />
            </Link>
            <Link href="/compte" className="hidden p-2 transition hover:text-bissap sm:block" aria-label="Mes favoris">
              <HeartIcon />
            </Link>
            <button
              className="relative p-2 transition hover:text-bissap"
              onClick={() => setOpen(true)}
              aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}
            >
              <BagIcon />
              {count > 0 && (
                <span
                  className={`absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-bissap text-[9px] font-semibold text-white transition-transform ${
                    pulse ? "scale-150" : "scale-100"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden ${
          menu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenu(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-creme p-6 transition-transform duration-500 lg:hidden ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menu}
      >
        <div className="mb-10 flex items-center justify-between">
          <span className="text-2xl font-extrabold">salma</span>
          <button onClick={() => setMenu(false)} aria-label="Fermer le menu">
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenu(false)}
              className="border-b border-line py-4 text-2xl font-bold tracking-tight"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/quiz"
            onClick={() => setMenu(false)}
            className="mt-6 flex items-center justify-center gap-2 bg-bissap py-4 font-semibold text-white"
          >
            <SparkIcon /> Trouver ma signature
          </Link>
        </nav>
      </aside>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
