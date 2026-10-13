import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StarIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductHero } from "@/components/product-hero";
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
      <ProductHero produit={p} univers={u} />

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
                  <p className="mt-1 text-sm text-muted">{a.auteur} · Achat vérifié</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-24 md:px-8">
        <h2 className="mb-10 text-4xl font-extrabold tracking-tighter md:text-6xl">Vous aimerez aussi</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {produitsAssocies(p).map((x, i) => (
            <ProductCard key={x.slug} produit={x} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
