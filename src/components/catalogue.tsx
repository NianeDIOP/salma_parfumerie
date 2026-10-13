"use client";

import { useMemo, useState } from "react";
import { familles, genres, occasions, prixMin, type Famille, type Genre, type Occasion, type Produit } from "@/lib/catalogue";
import { CloseIcon } from "./icons";
import { ProductCard } from "./product-card";

type Tri = "popularite" | "prix-asc" | "prix-desc" | "note";

const tris: { value: Tri; label: string }[] = [
  { value: "popularite", label: "Popularité" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "note", label: "Mieux notés" },
];

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function Catalogue({ produits }: { produits: Produit[] }) {
  const prixMax = Math.max(...produits.map(prixMin));
  const [fam, setFam] = useState<Famille[]>([]);
  const [gen, setGen] = useState<Genre[]>([]);
  const [occ, setOcc] = useState<Occasion[]>([]);
  const [intensite, setIntensite] = useState<number | null>(null);
  const [budget, setBudget] = useState(prixMax);
  const [tri, setTri] = useState<Tri>("popularite");
  const [mobile, setMobile] = useState(false);

  const famillesPresentes = familles.filter((f) => produits.some((p) => p.famille === f));

  const resultats = useMemo(() => {
    const r = produits.filter(
      (p) =>
        (!fam.length || fam.includes(p.famille)) &&
        (!gen.length || gen.includes(p.genre)) &&
        (!occ.length || p.occasions.some((o) => occ.includes(o))) &&
        (intensite == null || p.intensite === intensite) &&
        prixMin(p) <= budget,
    );
    return r.sort((a, b) => {
      if (tri === "prix-asc") return prixMin(a) - prixMin(b);
      if (tri === "prix-desc") return prixMin(b) - prixMin(a);
      if (tri === "note") return b.note - a.note;
      return b.avis - a.avis;
    });
  }, [produits, fam, gen, occ, intensite, budget, tri]);

  const actifs = [
    ...fam.map((v) => ({ label: v, retirer: () => setFam(toggle(fam, v)) })),
    ...gen.map((v) => ({ label: v, retirer: () => setGen(toggle(gen, v)) })),
    ...occ.map((v) => ({ label: v, retirer: () => setOcc(toggle(occ, v)) })),
    ...(intensite ? [{ label: `Intensité ${intensite}/4`, retirer: () => setIntensite(null) }] : []),
    ...(budget < prixMax ? [{ label: `≤ ${budget.toLocaleString("fr-FR")} FCFA`, retirer: () => setBudget(prixMax) }] : []),
  ];

  const filtres = (
    <div className="space-y-8 text-sm">
      {famillesPresentes.length > 1 && (
        <fieldset>
          <legend className="mb-3 font-bold">Famille olfactive</legend>
          {famillesPresentes.map((f) => (
            <label key={f} className="flex cursor-pointer items-center justify-between py-1">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={fam.includes(f)} onChange={() => setFam(toggle(fam, f))} className="size-3.5 accent-ink" />
                {f}
              </span>
              <span className="text-xs text-muted">{produits.filter((p) => p.famille === f).length}</span>
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 font-bold">Pour</legend>
        {genres.map((g) => (
          <label key={g} className="flex cursor-pointer items-center gap-2 py-1">
            <input type="checkbox" checked={gen.includes(g)} onChange={() => setGen(toggle(gen, g))} className="size-3.5 accent-ink" />
            {g}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold">Intensité</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIntensite(intensite === n ? null : n)}
              className={`h-2 flex-1 transition ${intensite != null && n <= intensite ? "bg-bissap" : "bg-line hover:bg-rose"}`}
              aria-label={`Intensité ${n} sur 4`}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Légère</span>
          <span>Intense</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold">Prix maximum</legend>
        <input
          type="range"
          min={5000}
          max={prixMax}
          step={500}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-bissap"
        />
        <p className="text-sm">{budget.toLocaleString("fr-FR")} FCFA</p>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold">Occasion</legend>
        <div className="flex flex-wrap gap-1.5">
          {occasions.map((o) => (
            <button
              key={o}
              onClick={() => setOcc(toggle(occ, o))}
              className={`border px-3 py-1.5 text-xs transition ${occ.includes(o) ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
            >
              {o}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <p className="mb-6 text-xl font-bold">Filtrer</p>
        {filtres}
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button onClick={() => setMobile(true)} className="border border-ink px-4 py-2 text-sm lg:hidden">
            Filtrer {actifs.length > 0 && `(${actifs.length})`}
          </button>
          {actifs.map((a) => (
            <button key={a.label} onClick={a.retirer} className="flex items-center gap-1 border border-line bg-white px-3 py-1.5 text-xs">
              {a.label} <CloseIcon className="size-3" />
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted">Trier :</span>
            <select value={tri} onChange={(e) => setTri(e.target.value as Tri)} className="bg-transparent font-semibold outline-none">
              {tris.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mb-4 text-sm text-muted">
          {resultats.length} produit{resultats.length > 1 ? "s" : ""}
        </p>

        {resultats.length === 0 ? (
          <p className="py-20 text-center text-muted">Aucun produit ne correspond à ces filtres.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 xl:grid-cols-3">
            {resultats.map((p, i) => (
              <ProductCard key={p.slug} produit={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Filtres mobile */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden ${mobile ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobile(false)}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto bg-creme p-6 transition-transform duration-500 lg:hidden ${
          mobile ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-bold">Filtrer</p>
          <button onClick={() => setMobile(false)} aria-label="Fermer">
            <CloseIcon />
          </button>
        </div>
        {filtres}
        <button onClick={() => setMobile(false)} className="mt-8 w-full bg-ink py-4 text-sm font-semibold text-white">
          Voir {resultats.length} produit{resultats.length > 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
