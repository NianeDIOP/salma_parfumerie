"use client";

import { useMemo, useState } from "react";
import { BarreEnregistrer, Bouton, Carte, Champ, Liste, Notification, Saisie, SaisieNombre, useAction } from "@/components/admin/ui";
import { Photo } from "@/components/photo";
import { ajusterPrix, majStocks } from "@/lib/actions/admin";
import type { Produit, Univers } from "@/lib/catalogue";

type Cle = string; // slug|contenance

export function TableStocks({ produits, univers }: { produits: Produit[]; univers: Univers[] }) {
  const { enCours, retour, lancer } = useAction();
  const [modifs, setModifs] = useState<Record<Cle, { stock?: number; prix?: number }>>({});
  const [q, setQ] = useState("");
  const [seulementAlertes, setSeulementAlertes] = useState(false);
  const [pourcent, setPourcent] = useState(0);
  const [filtreUnivers, setFiltreUnivers] = useState("");

  const lignes = useMemo(
    () =>
      produits.flatMap((p) => p.contenances.map((c) => ({ p, c, cle: `${p.slug}|${c.label}` }))).filter(({ p, c }) => (!q || `${p.marque} ${p.nom}`.toLowerCase().includes(q.toLowerCase())) && (!seulementAlertes || c.stock <= (p.seuilAlerte ?? 5))),
    [produits, q, seulementAlertes],
  );
  const nbModifs = Object.keys(modifs).length;
  const maj = (cle: Cle, v: { stock?: number; prix?: number }) => setModifs({ ...modifs, [cle]: { ...modifs[cle], ...v } });

  return (
    <>
      <Carte titre="Ajuster les prix en masse" description="Augmentez ou baissez tous les prix d'un pourcentage (arrondi à 100 F).">
        <div className="flex flex-wrap items-end gap-3">
          <Champ label="Variation (%)" className="w-32">
            <SaisieNombre value={pourcent} onChange={setPourcent} step={1} />
          </Champ>
          <Champ label="Univers" className="w-56">
            <Liste value={filtreUnivers} onChange={(e) => setFiltreUnivers(e.target.value)} options={[{ value: "", label: "Tous" }, ...univers.map((u) => ({ value: u.slug, label: u.nom }))]} />
          </Champ>
          <Bouton
            variante="secondaire"
            disabled={!pourcent || enCours}
            onClick={() => confirm(`Appliquer ${pourcent > 0 ? "+" : ""}${pourcent} % aux prix ?`) && lancer(() => ajusterPrix(pourcent, { univers: filtreUnivers || undefined }), () => setPourcent(0))}
          >
            Appliquer
          </Bouton>
        </div>
      </Carte>

      <div className="mb-3 mt-6 flex flex-wrap items-center gap-3">
        <Saisie value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="max-w-sm" />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={seulementAlertes} onChange={(e) => setSeulementAlertes(e.target.checked)} className="size-4 accent-bissap" />
          Seulement les alertes
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-creme-light text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Produit</th>
              <th className="px-4 py-3 font-semibold">Contenance</th>
              <th className="w-40 px-4 py-3 font-semibold">Prix (FCFA)</th>
              <th className="w-32 px-4 py-3 font-semibold">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lignes.map(({ p, c, cle }) => {
              const m = modifs[cle] ?? {};
              const stock = m.stock ?? c.stock;
              const alerte = stock <= (p.seuilAlerte ?? 5);
              return (
                <tr key={cle} className={stock === 0 ? "bg-bissap/5" : alerte ? "bg-[#d9a521]/10" : ""}>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg" style={{ background: p.theme.bg }}>
                        <Photo id={p.images[0] ?? ""} alt="" sizes="40px" />
                      </span>
                      <span>
                        <span className="block font-semibold">{p.nom}</span>
                        <span className="text-xs text-muted">{p.marque}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2">{c.label}</td>
                  <td className="px-4 py-2">
                    <SaisieNombre value={m.prix ?? c.prix} step={500} min={0} onChange={(n) => maj(cle, { prix: n })} className={m.prix !== undefined ? "border-bissap" : ""} />
                  </td>
                  <td className="px-4 py-2">
                    <SaisieNombre value={stock} min={0} onChange={(n) => maj(cle, { stock: n })} className={m.stock !== undefined ? "border-bissap" : ""} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BarreEnregistrer
        modifie={nbModifs > 0}
        enCours={enCours}
        libelle={`Enregistrer ${nbModifs} modification${nbModifs > 1 ? "s" : ""}`}
        onAnnuler={() => setModifs({})}
        onEnregistrer={() =>
          lancer(
            () => majStocks(Object.entries(modifs).map(([cle, v]) => ({ slug: cle.split("|")[0], contenance: cle.split("|").slice(1).join("|"), ...v }))),
            (r) => r.ok && setModifs({}),
          )
        }
      />
      <Notification retour={retour} />
    </>
  );
}
