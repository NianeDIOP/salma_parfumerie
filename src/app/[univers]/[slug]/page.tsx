import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bottle } from "@/components/bottle";
import { StarIcon } from "@/components/icons";
import { ProductBuy } from "@/components/product-buy";
import { ProductCard } from "@/components/product-card";
import { Jauge, Pyramid } from "@/components/pyramid";
import { Reveal } from "@/components/reveal";
import { getProduit, getUnivers, produits, produitsAssocies } from "@/lib/catalogue";

export function generateStaticParams() {
  return produits.map((p) => ({ univers: p.univers, slug: p.slug }));
}

async function charger(params: PageProps<"/[univers]/[slug]">["params"]) {
  const { univers, slug } = await params;
  const p = getProduit(slug);
  return p && p.univers === univers ? p : undefined;
}

export async function generateMetadata({ params }: PageProps<"/[univers]/[slug]">): Promise<Metadata> {
  const p = await charger(params);
  return p ? { title: p.nom, description: p.description } : {};
}

// Avis fictifs, en attendant le module d'avis vérifiés du back-office
const avis = [
  { note: 5, texte: "Je reçois des compliments à chaque sortie. La tenue est incroyable.", auteur: "Mariama D." },
  { note: 5, texte: "Commandé le matin, payé avec Wave, livré l'après-midi.", auteur: "Ibrahima S." },
  { note: 4, texte: "Très élégant, parfait pour les cérémonies. Le coffret est magnifique.", auteur: "Awa F." },
];

export default async function ProduitPage({ params }: PageProps<"/[univers]/[slug]">) {
  const p = await charger(params);
  if (!p) notFound();
  const u = getUnivers(p.univers)!;

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:px-8 lg:grid-cols-[80px_1fr_1fr]">
        <div className="hidden flex-col gap-3 lg:flex">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`grid aspect-square place-items-center ${i === 0 ? "ring-1 ring-ink" : ""}`}
              style={{ background: i === 1 ? "#ece6df" : p.visuel.fond }}
            >
              <Bottle {...p.visuel} className="h-14" label={i === 0} shadow={false} />
            </div>
          ))}
        </div>

        <div className="relative grid aspect-square place-items-center overflow-hidden" style={{ background: p.visuel.fond }}>
          <span className="absolute left-4 top-4 bg-white px-2 py-1 font-mono text-[11px]">360°</span>
          <div className="animate-float">
            <Bottle {...p.visuel} className="h-[340px] w-auto drop-shadow-2xl md:h-[420px]" />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted">
            <Link href={`/${u.slug}`} className="hover:text-ink">
              {u.nom}
            </Link>{" "}
            › {p.famille}
          </p>
          {p.badge && <p className="mt-3 text-xs font-semibold text-bissap">{p.badge}</p>}
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">{p.nom}</h1>
          <p className="mt-1 text-muted">
            {p.type}, {p.famille.toLowerCase()}
          </p>
          <p className="mt-2 flex items-center gap-1 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} className={`size-3.5 ${i < Math.round(p.note) ? "text-ink" : "text-line"}`} />
            ))}
            <span className="ml-1 text-muted">
              {p.note} · {p.avis} avis vérifiés
            </span>
          </p>
          <p className="mt-5 max-w-lg leading-relaxed">{p.description}</p>
          <ProductBuy produit={p} />
        </div>
      </section>

      <section className="border-t border-line bg-creme-light">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1fr_1fr_1fr]">
          <Reveal className="flex justify-center">
            <Pyramid pyramide={p.pyramide} />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-2xl font-bold">Portrait olfactif</h2>
            <div className="mt-6 space-y-4">
              <Jauge label="Tenue" valeur={p.tenue.valeur} texte={p.tenue.label} />
              <Jauge label="Sillage" valeur={p.sillage.valeur} texte={p.sillage.label} />
              <Jauge label="Saison" valeur={p.saison.valeur} texte={p.saison.label} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="border border-line px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
            <dl className="mt-8 space-y-3 text-sm">
              {(
                [
                  ["Tête", p.pyramide.tete],
                  ["Cœur", p.pyramide.coeur],
                  ["Fond", p.pyramide.fond],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[60px_1fr]">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-muted">{v.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={240}>
            <h2 className="text-2xl font-bold">Ils l&apos;adorent</h2>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {avis.map((a) => (
                <li key={a.auteur} className="py-4">
                  <p className="flex gap-0.5">
                    {Array.from({ length: a.note }, (_, i) => (
                      <StarIcon key={i} className="size-3" />
                    ))}
                  </p>
                  <p className="mt-2 text-sm">« {a.texte} »</p>
                  <p className="mt-1 text-[11px] text-muted">{a.auteur} · Achat vérifié</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight">Vous aimerez aussi</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {produitsAssocies(p).map((x, i) => (
            <Reveal key={x.slug} delay={i * 80}>
              <ProductCard produit={x} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
