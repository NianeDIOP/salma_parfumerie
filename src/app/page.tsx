import Link from "next/link";
import { Bottle } from "@/components/bottle";
import { HeroBottle } from "@/components/hero-bottle";
import { ArrowIcon, SparkIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Pyramid } from "@/components/pyramid";
import { Reveal } from "@/components/reveal";
import { bestSellers, getProduit, produitsDeUnivers, univers } from "@/lib/catalogue";

const visuelsUnivers = {
  parfums: { forme: "octogone", verre: "#7a1f35", bouchon: "#141414" },
  huiles: { forme: "fin", verre: "#d39a3a", bouchon: "#141414" },
  cosmetiques: { forme: "pot", verre: "#f4dcc2", bouchon: "#ffffff" },
  maison: { forme: "diffuseur", verre: "#8cc3c9", bouchon: "#6b4b33" },
} as const;

const reassurance = [
  { titre: "24 h", texte: "Livraison à Dakar pour toute commande avant 15 h" },
  { titre: "1 clic", texte: "Paiement Wave, Orange Money, Free Money ou carte" },
  { titre: "Offert", texte: "Un échantillon au choix dans chaque commande" },
  { titre: "7 jours", texte: "Produits scellés retournables sans frais" },
];

export default function Home() {
  const vedette = getProduit("nuit-de-teranga")!;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center px-4 py-14 md:px-8 lg:py-24">
          <p className="animate-fade-up font-mono text-xs text-bissap">Nouvelle collection, automne 2026</p>
          <h1 className="mt-5 animate-fade-up text-5xl font-extrabold leading-[0.95] tracking-tight [animation-delay:120ms] md:text-7xl">
            Le parfum de <span className="text-bissap">votre identité.</span>
          </h1>
          <p className="mt-6 max-w-md animate-fade-up text-muted [animation-delay:240ms]">
            Découvrez Nuit de Téranga, un oriental boisé où l&apos;oud rencontre la rose, pour signer chacun de vos
            instants.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:360ms]">
            <Link href="/parfums" className="bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-bissap">
              Découvrir la collection
            </Link>
            <Link
              href="/quiz"
              className="flex items-center gap-2 border border-ink px-6 py-3.5 text-sm font-semibold transition hover:bg-ink hover:text-white"
            >
              <SparkIcon /> Trouver ma signature
            </Link>
          </div>
          <dl className="mt-12 flex animate-fade-up gap-10 border-t border-line pt-6 [animation-delay:480ms]">
            {[
              ["120+", "fragrances"],
              ["24 h", "livraison Dakar"],
              ["4,8/5", "avis clients"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-2xl font-extrabold">{v}</dt>
                <dd className="text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroBottle />
      </section>

      {/* Univers */}
      <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {univers.map((u, i) => {
            const v = visuelsUnivers[u.slug];
            return (
              <Reveal key={u.slug} delay={i * 90}>
                <Link
                  href={`/${u.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden p-5 text-white md:aspect-[5/4]"
                  style={{ background: u.couleur }}
                >
                  <div className="absolute -right-2 top-4 h-[70%] transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-6 group-hover:scale-110">
                    <Bottle {...v} className="h-full w-auto" />
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <p className="text-lg font-bold md:text-2xl">{u.nom}</p>
                    <p className="text-xs text-white/75">{u.accroche}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Bannière quiz */}
      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
        <Reveal>
          <div className="relative flex flex-col items-center gap-6 overflow-hidden bg-nuit px-6 py-10 text-white md:flex-row md:px-12">
            <Bottle forme="rond" verre="#e6a3ac" bouchon="#f3e8e3" className="h-32 w-auto shrink-0 animate-float" />
            <div className="flex-1 text-center md:text-left">
              <p className="font-mono text-xs text-white/60">6 questions, 60 secondes</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Quelle est votre signature olfactive ?</h2>
              <p className="mt-2 text-sm text-white/70">Répondez au quiz et recevez trois fragrances choisies pour vous.</p>
            </div>
            <Link href="/quiz" className="bg-white px-6 py-3.5 text-sm font-semibold text-nuit transition hover:bg-rose">
              Commencer le quiz
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Best-sellers */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best-sellers du moment</h2>
          <Link href="/parfums" className="flex items-center gap-1 text-sm hover:text-bissap">
            Tout voir <ArrowIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {bestSellers().map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard produit={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Storytelling */}
      <section className="mt-24 bg-creme-light">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-xs text-bissap">L&apos;histoire d&apos;un sillage</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Comprendre un parfum avant même de le sentir.
            </h2>
            <p className="mt-6 max-w-lg text-muted">
              Chaque fragrance SALMA se dévoile en trois temps : des notes de tête lumineuses, un cœur qui affirme son
              caractère, un fond qui reste sur la peau des heures durant. {vedette.description}
            </p>
            <Link
              href={`/parfums/${vedette.slug}`}
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-bissap pb-1 font-semibold text-bissap"
            >
              Explorer Nuit de Téranga <ArrowIcon />
            </Link>
          </Reveal>
          <Reveal delay={150} className="flex justify-center">
            <Pyramid pyramide={vedette.pyramide} />
          </Reveal>
        </div>
      </section>

      {/* Huiles */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Les senteurs de chez nous</h2>
          <Link href="/huiles" className="flex items-center gap-1 text-sm hover:text-bissap">
            Huiles parfumées <ArrowIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {[...produitsDeUnivers("huiles"), ...produitsDeUnivers("maison")].slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard produit={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Réassurance */}
      <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8">
        <div className="grid grid-cols-2 border-t border-ink lg:grid-cols-4">
          {reassurance.map((r, i) => (
            <Reveal key={r.titre} delay={i * 80} className="border-b border-line py-8 pr-6 lg:border-b-0">
              <p className="text-3xl font-extrabold text-bissap">{r.titre}</p>
              <p className="mt-2 text-sm text-muted">{r.texte}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
