import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { ScentFamilies } from "@/components/home/scent-families";
import { UniversGrid } from "@/components/home/univers-grid";
import { ArrowIcon, SparkIcon } from "@/components/icons";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax, RevealImage } from "@/components/motion/parallax";
import { SplitText } from "@/components/motion/split-text";
import { Photo } from "@/components/photo";
import { ProductCard } from "@/components/product-card";
import { ambiances, bestSellers, getProduit, produits, produitsDeUnivers, univers } from "@/lib/catalogue";

const vedettes = ["coco-noir", "bleu-de-chanel", "coco-mademoiselle", "versace-eros"].map((s) => getProduit(s)!);

const familles = [
  {
    titre: "La légèreté d'un matin à Gorée.",
    texte: "Agrumes, notes marines et bois clairs : des parfums lumineux pour le quotidien et la saison chaude.",
    produit: getProduit("acqua-di-gio")!,
  },
  {
    titre: "Un bouquet qui vous ressemble.",
    texte: "Rose, jasmin et fleur d'oranger : des sillages féminins, élégants, pleins de lumière.",
    produit: getProduit("coco-mademoiselle")!,
  },
  {
    titre: "La magie des nuits de Dakar.",
    texte: "Oud, vanille, encens et ambre : des parfums intenses pour les soirées et les grandes cérémonies.",
    produit: getProduit("coco-noir")!,
  },
];

const marques = ["Chanel", "Versace", "Yves Saint Laurent", "Giorgio Armani", "Prada", "Dolce & Gabbana", "Miu Miu", "Maison SALMA"];

const reassurance = [
  { titre: "24 h", texte: "Livraison à Dakar pour toute commande passée avant 15 h" },
  { titre: "1 clic", texte: "Paiement Wave, Orange Money, Free Money ou carte" },
  { titre: "100 %", texte: "Produits authentiques, achetés auprès des distributeurs officiels" },
  { titre: "Offert", texte: "Un échantillon au choix dans chaque commande" },
];

export default function Home() {
  const compte = Object.fromEntries(univers.map((u) => [u.slug, produitsDeUnivers(u.slug).length]));
  const maisonSalma = produits.filter((p) => p.marque === "Maison SALMA").slice(0, 4);

  return (
    <>
      <Hero slides={vedettes} />

      <section className="overflow-hidden border-b border-line py-8 md:py-10" aria-label="Nos marques">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap text-4xl font-extrabold tracking-tighter md:text-6xl">
          {[...marques, ...marques].map((m, i) => (
            <span key={i} className={i % 2 ? "text-bissap" : ""}>
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* Manifeste */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-[1.2fr_1fr] md:px-8 md:py-36">
        <h2 className="text-4xl font-extrabold leading-[1] tracking-tighter md:text-7xl">
          <SplitText text="Une maison de parfum, pas un simple catalogue." inView stagger={0.05} />
        </h2>
        <div className="flex flex-col justify-end gap-6">
          <p className="text-xl leading-snug text-muted">
            Les plus grandes maisons de parfum et nos créations SALMA, réunies à Dakar. Chaque flacon est authentique, choisi
            avec soin, et livré avec un échantillon pour vous faire découvrir une nouvelle signature.
          </p>
          <Link href="/parfums" className="group inline-flex items-center gap-3 self-start text-lg font-semibold">
            <span className="border-b-2 border-ink pb-1">Explorer les parfums</span>
            <span className="grid size-10 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-[-45deg]">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </section>

      <UniversGrid univers={univers} compte={compte} />

      {/* Best-sellers */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
            <SplitText text="Les plus désirés" inView />
          </h2>
          <Link href="/parfums" className="hidden items-center gap-2 text-sm font-semibold hover:text-bissap md:flex">
            Tout voir <ArrowIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {bestSellers().map((p, i) => (
            <ProductCard key={p.slug} produit={p} index={i} />
          ))}
        </div>
      </section>

      <ScentFamilies familles={familles} />

      {/* Éditorial + quiz */}
      <section className="relative">
        <Parallax className="h-[90vh] min-h-[560px]" offset={120}>
          <Photo id={ambiances.collection} alt="Collection de flacons de parfum" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/50 to-transparent" />
        </Parallax>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 text-white md:px-8 md:pb-24">
            <h2 className=" max-w-3xl text-5xl font-extrabold leading-[0.92] tracking-tighter md:text-8xl">
              <SplitText text="Quelle est votre signature ?" inView />
            </h2>
            <p className="mt-6 max-w-md text-xl text-white/85">Six questions, soixante secondes, et trois fragrances choisies pour vous.</p>
            <Magnetic className="mt-10">
              <Link href="/quiz" className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-nuit transition hover:bg-rose">
                <SparkIcon /> Commencer le quiz
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Maison SALMA */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className=" text-5xl font-extrabold leading-[0.92] tracking-tighter md:text-6xl">
            <SplitText text="Les senteurs de chez nous." inView />
          </h2>
          <p className="mt-6 max-w-sm text-xl text-muted">
            Thiouraye, musc, huiles précieuses et bougies : nos créations, inspirées des maisons sénégalaises.
          </p>
          <RevealImage className="mt-10 hidden aspect-[4/3] lg:block" color="var(--color-nuit)">
            <Photo id={ambiances.lumiere} alt="Flacon dans la lumière" sizes="35vw" />
          </RevealImage>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6">
          {maisonSalma.map((p, i) => (
            <ProductCard key={p.slug} produit={p} index={i} />
          ))}
        </div>
      </section>

      {/* Réassurance */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 border-t border-ink lg:grid-cols-4">
          {reassurance.map((r) => (
            <div key={r.titre} className="border-b border-line py-10 pr-6 lg:border-b-0">
              <p className="text-5xl font-extrabold tracking-tighter text-bissap">{r.titre}</p>
              <p className="mt-3 text-base text-muted">{r.texte}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
