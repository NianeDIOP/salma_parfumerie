import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { ScentFamilies } from "@/components/home/scent-families";
import { UniversGrid } from "@/components/home/univers-grid";
import { ArrowIcon, SparkIcon } from "@/components/icons";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax, RevealImage } from "@/components/motion/parallax";
import { SplitText } from "@/components/motion/split-text";
import { Photo } from "@/components/photo";
import { ProductCard, ProductRail } from "@/components/product-card";
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

      {/* Univers en pastilles (mobile) */}
      <nav className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 pt-6 md:hidden" aria-label="Univers">
        {univers.map((u) => (
          <Link key={u.slug} href={`/${u.slug}`} className="flex w-[76px] shrink-0 flex-col items-center gap-2 active:scale-95">
            <span className="relative size-[72px] overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-creme" style={{ background: u.theme.bg, ["--tw-ring-color" as string]: u.theme.bg }}>
              <Photo id={u.image} alt="" sizes="72px" />
            </span>
            <span className="w-full truncate text-center text-sm font-medium">{u.nom.split(" ")[0]}</span>
          </Link>
        ))}
        <Link href="/coffrets" className="flex w-[76px] shrink-0 flex-col items-center gap-2 active:scale-95">
          <span className="grid size-[72px] place-items-center rounded-full bg-rose text-3xl ring-2 ring-rose ring-offset-2 ring-offset-creme">🎁</span>
          <span className="text-sm font-medium">Coffrets</span>
        </Link>
      </nav>

      <section className="overflow-hidden border-b border-line py-6 md:py-10" aria-label="Nos marques">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-3xl font-extrabold tracking-tighter md:gap-16 md:text-6xl">
          {[...marques, ...marques].map((m, i) => (
            <span key={i} className={i % 2 ? "text-bissap" : ""}>
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* Manifeste */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-8 md:py-36">
        <h2 className="text-[40px] font-extrabold leading-[1] tracking-tighter md:text-7xl">
          <SplitText text="Une maison de parfum, pas un simple catalogue." inView stagger={0.05} />
        </h2>
        <div className="flex flex-col justify-end gap-6">
          <p className="text-lg leading-snug text-muted md:text-xl">
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

      <div className="hidden md:block">
        <UniversGrid univers={univers} compte={compte} />
      </div>

      {/* Best-sellers */}
      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8 md:py-32">
        <div className="mb-5 flex items-end justify-between gap-6 md:mb-12">
          <h2 className="text-[34px] font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
            <SplitText text="Les plus désirés" inView />
          </h2>
          <Link href="/parfums" className="flex shrink-0 items-center gap-1.5 text-base font-semibold text-bissap md:text-ink md:hover:text-bissap">
            Tout voir <ArrowIcon />
          </Link>
        </div>
        <ProductRail produits={bestSellers()} />
      </section>

      <ScentFamilies familles={familles} />

      {/* Éditorial + quiz */}
      <section className="relative">
        <Parallax className="h-[78svh] min-h-[520px] md:h-[90vh]" offset={120}>
          <Photo id={ambiances.collection} alt="Collection de flacons de parfum" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/50 to-transparent" />
        </Parallax>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 text-white md:px-8 md:pb-24">
            <h2 className="max-w-3xl text-[44px] font-extrabold leading-[0.92] tracking-tighter md:text-8xl">
              <SplitText text="Quelle est votre signature ?" inView />
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/85 md:text-xl">Six questions, soixante secondes, et trois fragrances choisies pour vous.</p>
            <Magnetic className="mt-8">
              <Link href="/quiz" className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-nuit transition hover:bg-rose">
                <SparkIcon /> Commencer le quiz
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Maison SALMA */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:gap-12 md:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[34px] font-extrabold leading-[0.92] tracking-tighter md:text-6xl">
            <SplitText text="Les senteurs de chez nous." inView />
          </h2>
          <p className="mt-4 max-w-sm text-lg text-muted md:mt-6 md:text-xl">
            Thiouraye, musc, huiles précieuses et bougies : nos créations, inspirées des maisons sénégalaises.
          </p>
          <RevealImage className="mt-10 hidden aspect-[4/3] lg:block" color="var(--color-nuit)">
            <Photo id={ambiances.lumiere} alt="Flacon dans la lumière" sizes="35vw" />
          </RevealImage>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0">
          {maisonSalma.map((p, i) => (
            <ProductCard key={p.slug} produit={p} index={i} className="w-[44vw] shrink-0 snap-start md:w-auto" />
          ))}
        </div>
      </section>

      {/* Réassurance */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 border-t border-ink lg:grid-cols-4">
          {reassurance.map((r) => (
            <div key={r.titre} className="border-b border-line py-6 pr-4 md:py-10 md:pr-6 lg:border-b-0">
              <p className="text-4xl font-extrabold tracking-tighter text-bissap md:text-5xl">{r.titre}</p>
              <p className="mt-2 text-sm text-muted md:mt-3 md:text-base">{r.texte}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
