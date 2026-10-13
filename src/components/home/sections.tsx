// Rendu des sections de la page d'accueil, telles que configurées dans l'admin (Accueil).
import Link from "next/link";
import { IconeNommee } from "@/components/icon-set";
import { ArrowIcon, SparkIcon } from "@/components/icons";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";
import { SplitText } from "@/components/motion/split-text";
import { Photo } from "@/components/photo";
import { ProductRail } from "@/components/product-card";
import { bestSellers, type Produit } from "@/lib/catalogue";
import type { DonneesSite, Section, SectionProduits } from "@/lib/site";
import { Hero } from "./hero";
import { ScentFamilies } from "./scent-families";
import { UniversGrid } from "./univers-grid";

function produitsDeSection(s: SectionProduits, produits: Produit[]) {
  const n = Math.max(1, s.nombre || 8);
  if (s.mode === "selection") return s.produits.map((slug) => produits.find((p) => p.slug === slug)).filter((p): p is Produit => Boolean(p));
  if (s.mode === "univers") return produits.filter((p) => p.univers === s.univers).slice(0, n);
  if (s.mode === "marque") return produits.filter((p) => p.marque === s.marque).slice(0, n);
  return bestSellers(produits, n);
}

export function SectionAccueil({ section: s, donnees }: { section: Section; donnees: DonneesSite }) {
  const { produits, univers } = donnees;
  const trouver = (slug: string) => produits.find((p) => p.slug === slug);

  switch (s.type) {
    case "hero": {
      const slides = s.produits.map(trouver).filter((p): p is Produit => Boolean(p));
      if (!slides.length) return null;
      return <Hero slides={slides} duree={s.duree} bouton={s.boutonDecouvrir} />;
    }

    case "pastilles":
      return (
        <nav className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 pt-6 md:hidden" aria-label="Univers">
          {univers.map((u) => (
            <Link key={u.slug} href={`/${u.slug}`} className="flex w-[76px] shrink-0 flex-col items-center gap-2 active:scale-95">
              <span
                className="relative size-[72px] overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-creme"
                style={{ background: u.theme.bg, ["--tw-ring-color" as string]: u.theme.bg }}
              >
                <Photo id={u.image} alt="" sizes="72px" />
              </span>
              <span className="w-full truncate text-center text-sm font-medium">{u.nom.split(" ")[0]}</span>
            </Link>
          ))}
          {s.afficherCoffrets && (
            <Link href="/coffrets" className="flex w-[76px] shrink-0 flex-col items-center gap-2 active:scale-95">
              <span className="grid size-[72px] place-items-center rounded-full bg-rose text-3xl ring-2 ring-rose ring-offset-2 ring-offset-creme">🎁</span>
              <span className="text-sm font-medium">Coffrets</span>
            </Link>
          )}
        </nav>
      );

    case "marques":
      if (!s.marques.length) return null;
      return (
        <section className="overflow-hidden border-b border-line py-6 md:py-10" aria-label="Nos marques">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-3xl font-extrabold tracking-tighter md:gap-16 md:text-6xl">
            {[...s.marques, ...s.marques].map((m, i) => (
              <span key={i} className={i % 2 ? "text-bissap" : ""}>
                {m}
              </span>
            ))}
          </div>
        </section>
      );

    case "manifeste":
      return (
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-8 md:py-36">
          <h2 className="text-[40px] font-extrabold leading-[1] tracking-tighter md:text-7xl">
            <SplitText text={s.titre} inView stagger={0.05} />
          </h2>
          <div className="flex flex-col justify-end gap-6">
            <p className="whitespace-pre-line text-lg leading-snug text-muted md:text-xl">{s.texte}</p>
            {s.bouton.label && (
              <Link href={s.bouton.href} className="group inline-flex items-center gap-3 self-start text-lg font-semibold">
                <span className="border-b-2 border-ink pb-1">{s.bouton.label}</span>
                <span className="grid size-10 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <ArrowIcon />
                </span>
              </Link>
            )}
          </div>
        </section>
      );

    case "univers": {
      const compte = Object.fromEntries(univers.map((u) => [u.slug, produits.filter((p) => p.univers === u.slug).length]));
      return (
        <div className="hidden md:block">
          <UniversGrid univers={univers} compte={compte} titre={s.titre} titreAccent={s.titreAccent} />
        </div>
      );
    }

    case "produits": {
      const liste = produitsDeSection(s, produits);
      if (!liste.length) return null;
      return (
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-28">
          <div className="mb-5 flex items-end justify-between gap-6 md:mb-12">
            <div>
              <h2 className="text-[34px] font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
                <SplitText text={s.titre} inView />
              </h2>
              {s.texte && <p className="mt-4 max-w-xl text-lg text-muted md:text-xl">{s.texte}</p>}
            </div>
            {s.lien.label && (
              <Link href={s.lien.href} className="flex shrink-0 items-center gap-1.5 text-base font-semibold text-bissap md:text-ink md:hover:text-bissap">
                {s.lien.label} <ArrowIcon />
              </Link>
            )}
          </div>
          <ProductRail produits={liste} />
        </section>
      );
    }

    case "familles": {
      const items = s.items
        .map((it) => ({ ...it, produit: trouver(it.produit) }))
        .filter((it): it is { titre: string; texte: string; produit: Produit } => Boolean(it.produit));
      if (!items.length) return null;
      return <ScentFamilies familles={items} />;
    }

    case "editorial":
      return (
        <section className="relative">
          <Parallax className="h-[78svh] min-h-[520px] md:h-[90vh]" offset={120}>
            <Photo id={s.image} alt="" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/50 to-transparent" />
          </Parallax>
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-16 text-white md:px-8 md:pb-24">
              <h2 className="max-w-3xl text-[44px] font-extrabold leading-[0.92] tracking-tighter md:text-8xl">
                <SplitText text={s.titre} inView />
              </h2>
              {s.texte && <p className="mt-5 max-w-md text-lg text-white/85 md:text-xl">{s.texte}</p>}
              {s.bouton.label && (
                <Magnetic className="mt-8">
                  <Link href={s.bouton.href} className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-nuit transition hover:bg-rose">
                    <SparkIcon /> {s.bouton.label}
                  </Link>
                </Magnetic>
              )}
            </div>
          </div>
        </section>
      );

    case "reassurance":
      return (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid grid-cols-2 border-t border-ink lg:grid-cols-4">
            {s.items.map((r, i) => (
              <div key={i} className="border-b border-line py-6 pr-4 md:py-10 md:pr-6 lg:border-b-0">
                <IconeNommee nom={r.icone} className="size-7 text-bissap" />
                <p className="mt-3 text-4xl font-extrabold tracking-tighter text-bissap md:text-5xl">{r.titre}</p>
                <p className="mt-2 text-sm text-muted md:mt-3 md:text-base">{r.texte}</p>
              </div>
            ))}
          </div>
        </section>
      );
  }
}
