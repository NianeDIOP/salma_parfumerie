"use client";

import Link from "next/link";
import { useState } from "react";
import { Bottle } from "@/components/bottle";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { prixMin, produits, type Famille, type Produit } from "@/lib/catalogue";

interface Option {
  label: string;
  detail?: string;
  couleur: string;
  familles?: Famille[];
  intensite?: number;
  budget?: number;
}

interface Question {
  titre: string;
  aide: string;
  multiple?: boolean;
  options: Option[];
}

// Quiz « Ma Signature » : six questions visuelles → trois recommandations
const questions: Question[] = [
  {
    titre: "Pour quel moment ?",
    aide: "Choisissez une réponse",
    options: [
      { label: "Le jour", detail: "Bureau, rendez-vous", couleur: "#f3efd9", familles: ["Frais / Hespéridé", "Floral"], intensite: 2 },
      { label: "Le soir", detail: "Dîner, sortie", couleur: "#2c3466", familles: ["Oriental", "Fruité"], intensite: 4 },
      { label: "Les cérémonies", detail: "Mariage, baptême, Tabaski", couleur: "#a8153a", familles: ["Oriental", "Boisé"], intensite: 4 },
      { label: "Tous les jours", detail: "Ma seconde peau", couleur: "#ece6df", familles: ["Musqué", "Ambré"], intensite: 2 },
    ],
  },
  {
    titre: "Votre humeur du moment ?",
    aide: "Choisissez une réponse",
    options: [
      { label: "Lumineuse", couleur: "#f2d0d7", familles: ["Floral"] },
      { label: "Mystérieuse", couleur: "#4a2f24", familles: ["Oriental", "Boisé"] },
      { label: "Sereine", couleur: "#dfe6d6", familles: ["Musqué", "Frais / Hespéridé"] },
      { label: "Audacieuse", couleur: "#7a1f35", familles: ["Fruité", "Oriental"] },
    ],
  },
  {
    titre: "Quelles matières vous attirent ?",
    aide: "Choisissez jusqu'à deux réponses",
    multiple: true,
    options: [
      { label: "Bois précieux", detail: "Oud, santal, cèdre", couleur: "#5b3a26", familles: ["Boisé", "Oriental"] },
      { label: "Fleurs", detail: "Rose, jasmin, fleur d'oranger", couleur: "#e6b3b3", familles: ["Floral"] },
      { label: "Douceurs chaudes", detail: "Vanille, ambre, miel", couleur: "#e0a63a", familles: ["Ambré", "Oriental"] },
      { label: "Fraîcheur", detail: "Agrumes, menthe, thé", couleur: "#9fc9cf", familles: ["Frais / Hespéridé"] },
    ],
  },
  {
    titre: "Quelle intensité ?",
    aide: "Choisissez une réponse",
    options: [
      { label: "Murmure", detail: "Seuls les proches le sentent", couleur: "#f1efea", intensite: 1 },
      { label: "Présence", detail: "Un sillage élégant", couleur: "#f2d0d7", intensite: 2 },
      { label: "Affirmé", detail: "On se retourne sur vous", couleur: "#c9693a", intensite: 3 },
      { label: "Inoubliable", detail: "Votre parfum entre avant vous", couleur: "#a8153a", intensite: 4 },
    ],
  },
  {
    titre: "Votre saison préférée ?",
    aide: "Choisissez une réponse",
    options: [
      { label: "Saison sèche", detail: "Soleil, harmattan", couleur: "#e8cf9a", familles: ["Frais / Hespéridé", "Floral"] },
      { label: "Hivernage", detail: "Pluie, terre mouillée", couleur: "#6e7f5b", familles: ["Boisé", "Musqué"] },
      { label: "Les fêtes", detail: "Korité, Tabaski, fin d'année", couleur: "#1f2a5c", familles: ["Oriental", "Ambré"] },
      { label: "Toute l'année", couleur: "#ece6df" },
    ],
  },
  {
    titre: "Votre budget ?",
    aide: "Choisissez une réponse",
    options: [
      { label: "Moins de 25 000 FCFA", couleur: "#f1efea", budget: 25000 },
      { label: "25 000 à 45 000 FCFA", couleur: "#f2d0d7", budget: 45000 },
      { label: "45 000 à 70 000 FCFA", couleur: "#c9693a", budget: 70000 },
      { label: "Sans limite", couleur: "#1a1a1a", budget: Infinity },
    ],
  },
];

function recommander(reponses: number[][]): { produits: Produit[]; profil: Famille } {
  const scoreFamille = new Map<Famille, number>();
  let intensite = 0;
  let nIntensite = 0;
  let budget = Infinity;

  reponses.forEach((choix, qi) =>
    choix.forEach((oi) => {
      const o = questions[qi].options[oi];
      o.familles?.forEach((f, rang) => scoreFamille.set(f, (scoreFamille.get(f) ?? 0) + (rang === 0 ? 2 : 1)));
      if (o.intensite) {
        intensite += o.intensite;
        nIntensite++;
      }
      if (o.budget) budget = o.budget;
    }),
  );

  const cible = nIntensite ? intensite / nIntensite : 2.5;
  const scorer = (p: Produit) =>
    (scoreFamille.get(p.famille) ?? 0) * 3 - Math.abs(p.intensite - cible) * 2 + (prixMin(p) <= budget ? 4 : -6) + p.note;

  const tries = produits.filter((p) => p.univers === "parfums" || p.univers === "huiles").sort((a, b) => scorer(b) - scorer(a));
  const profil = [...scoreFamille.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Oriental";
  return { produits: tries.slice(0, 3), profil };
}

const petales = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 41) % 100}%`,
  delay: `${(i % 8) * 0.25}s`,
  duree: `${3 + (i % 5) * 0.6}s`,
  rot: (i * 47) % 360,
}));

export function Quiz() {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<number[][]>(questions.map(() => []));
  const fini = etape >= questions.length;

  if (fini) {
    const { produits: recos, profil } = recommander(reponses);
    return (
      <section className="relative overflow-hidden">
        <div className="relative bg-bissap px-4 py-16 text-center text-white">
          {petales.map((p, i) => (
            <span
              key={i}
              className="pointer-events-none absolute -top-4 h-3 w-2 rounded-full bg-rose"
              style={{ left: p.left, animation: `petale ${p.duree} ${p.delay} ease-in forwards`, rotate: `${p.rot}deg` }}
            />
          ))}
          <p className="font-mono text-xs text-white/70">Votre profil olfactif</p>
          <h1 className="mt-3 animate-fade-up text-5xl font-extrabold tracking-tight md:text-6xl">{profil}</h1>
          <p className="mx-auto mt-4 max-w-md text-white/80">Voici les trois fragrances que nous avons choisies pour vous.</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 md:px-8">
          {recos.map((p, i) => (
            <div key={p.slug} className="animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
              <ProductCard produit={p} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 pb-8">
          <button
            onClick={() => {
              setReponses(questions.map(() => []));
              setEtape(0);
            }}
            className="border border-ink px-6 py-3 text-sm"
          >
            Refaire le quiz
          </button>
          <button
            onClick={() => {
              const texte = `Ma signature olfactive SALMA : ${profil} ✨`;
              if (navigator.share) navigator.share({ text: texte, url: location.href }).catch(() => {});
              else navigator.clipboard?.writeText(`${texte} ${location.href}`);
            }}
            className="bg-ink px-6 py-3 text-sm text-white"
          >
            Partager mon résultat
          </button>
        </div>
        <style>{`@keyframes petale { to { transform: translateY(420px) rotate(260deg); opacity: 0; } }`}</style>
      </section>
    );
  }

  const q = questions[etape];
  const choix = reponses[etape];

  const choisir = (i: number) => {
    const suivant = [...reponses];
    if (q.multiple) {
      suivant[etape] = choix.includes(i) ? choix.filter((x) => x !== i) : [...choix, i].slice(-2);
      setReponses(suivant);
    } else {
      suivant[etape] = [i];
      setReponses(suivant);
      setTimeout(() => setEtape((e) => e + 1), 350);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Quitter le quiz">
          <CloseIcon className="size-5" />
        </Link>
        <p className="font-bold">Ma Signature</p>
        <p className="font-mono text-sm">
          {etape + 1} / {questions.length}
        </p>
      </div>
      <div className="mt-4 h-1 bg-line">
        <div className="h-full bg-bissap transition-all duration-500" style={{ width: `${((etape + 1) / questions.length) * 100}%` }} />
      </div>

      <div key={etape} className="animate-fade-up">
        <p className="mt-10 font-mono text-xs text-bissap">Question {etape + 1}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">{q.titre}</h1>
        <p className="mt-2 text-sm text-muted">{q.aide}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {q.options.map((o, i) => {
            const actif = choix.includes(i);
            return (
              <button
                key={o.label}
                onClick={() => choisir(i)}
                className={`group relative bg-white p-2 text-left transition ${actif ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink"}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden" style={{ background: o.couleur }}>
                  <div className="absolute -bottom-6 right-2 h-24 opacity-30 transition-transform duration-500 group-hover:-translate-y-3">
                    <Bottle forme="fin" verre="#ffffff" bouchon="#ffffff" label={false} shadow={false} className="h-full w-auto" />
                  </div>
                </div>
                {actif && (
                  <span className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-ink text-white">
                    <CheckIcon className="size-3.5" />
                  </span>
                )}
                <p className="mt-2 px-1 text-sm font-bold">{o.label}</p>
                {o.detail && <p className="px-1 pb-1 text-[11px] text-muted">{o.detail}</p>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        {etape > 0 && (
          <button onClick={() => setEtape(etape - 1)} className="border border-ink px-6 py-4 text-sm">
            ←
          </button>
        )}
        <button
          onClick={() => setEtape(etape + 1)}
          disabled={!choix.length}
          className="flex-1 bg-ink py-4 text-sm font-semibold text-white transition disabled:opacity-30"
        >
          {etape === questions.length - 1 ? "Découvrir ma signature" : "Question suivante →"}
        </button>
      </div>
    </section>
  );
}
