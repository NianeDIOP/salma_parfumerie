"use client";

import { useState } from "react";
import { BarreEnregistrer, Bouton, Champ, ChampImage, ChampLien, ChoixProduits, Interrupteur, Liste, ListeOrdonnee, Notification, Saisie, SaisieNombre, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { ICONES, IconeNommee } from "@/components/icon-set";
import { enregistrerReglages } from "@/lib/actions/admin";
import type { Produit, Univers } from "@/lib/catalogue";
import { nouvelId, typesSections, type Section } from "@/lib/site";

function sectionNeuve(type: Section["type"]): Section {
  const id = nouvelId(type);
  switch (type) {
    case "hero":
      return { id, type, visible: true, produits: [], duree: 6, boutonDecouvrir: "Découvrir" };
    case "pastilles":
      return { id, type, visible: true, afficherCoffrets: true };
    case "marques":
      return { id, type, visible: true, marques: [] };
    case "manifeste":
      return { id, type, visible: true, titre: "Nouveau titre", texte: "", bouton: { label: "", href: "/" } };
    case "univers":
      return { id, type, visible: true, titre: "Nos", titreAccent: "univers." };
    case "produits":
      return { id, type, visible: true, titre: "Sélection", texte: "", mode: "meilleures-ventes", produits: [], univers: "", marque: "", nombre: 8, lien: { label: "Tout voir", href: "/boutique" } };
    case "familles":
      return { id, type, visible: true, items: [] };
    case "editorial":
      return { id, type, visible: true, titre: "Grand titre", texte: "", image: "", bouton: { label: "", href: "/" } };
    case "reassurance":
      return { id, type, visible: true, items: [{ icone: "camion", titre: "24 h", texte: "Livraison rapide" }] };
  }
}

function resume(s: Section) {
  switch (s.type) {
    case "hero":
      return `${s.produits.length} parfum(s) · ${s.duree} s`;
    case "manifeste":
    case "editorial":
    case "produits":
      return s.titre;
    case "univers":
      return `${s.titre} ${s.titreAccent}`;
    case "marques":
      return s.marques.join(", ");
    case "familles":
    case "reassurance":
      return `${s.items.length} élément(s)`;
    default:
      return "";
  }
}

export function EditeurAccueil({ sections, produits, univers }: { sections: Section[]; produits: Produit[]; univers: Univers[] }) {
  const b = useBrouillon(sections);
  const [ouverte, setOuverte] = useState<string | null>(null);
  const [ajout, setAjout] = useState(false);
  const { enCours, retour, lancer } = useAction();
  const marques = [...new Set(produits.map((p) => p.marque))];

  const editeur = (s: Section, maj: (v: Section) => void) => {
    switch (s.type) {
      case "hero":
        return (
          <div className="space-y-3">
            <Champ label="Parfums du carrousel (dans l'ordre)">
              <ChoixProduits produits={produits} valeur={s.produits} onChange={(v) => maj({ ...s, produits: v })} />
            </Champ>
            <div className="grid grid-cols-2 gap-3">
              <Champ label="Durée par parfum (secondes)">
                <SaisieNombre value={s.duree} min={2} max={30} onChange={(n) => maj({ ...s, duree: n })} />
              </Champ>
              <Champ label="Texte du bouton">
                <Saisie value={s.boutonDecouvrir} onChange={(e) => maj({ ...s, boutonDecouvrir: e.target.value })} />
              </Champ>
            </div>
            <p className="text-sm text-muted">Les couleurs de fond viennent de chaque produit (Produits › Couleurs du produit).</p>
          </div>
        );
      case "pastilles":
        return <Interrupteur checked={s.afficherCoffrets} onChange={(v) => maj({ ...s, afficherCoffrets: v })} label="Ajouter la pastille « Coffrets »" />;
      case "marques":
        return <ListeOrdonnee items={s.marques} onChange={(m) => maj({ ...s, marques: m })} nouveau={() => ""} libelleAjout="Ajouter une marque" rendu={(m, set) => <Saisie value={m} onChange={(e) => set(e.target.value)} />} />;
      case "manifeste":
        return (
          <div className="space-y-3">
            <Champ label="Titre">
              <Saisie value={s.titre} onChange={(e) => maj({ ...s, titre: e.target.value })} />
            </Champ>
            <Champ label="Texte">
              <Zone value={s.texte} onChange={(e) => maj({ ...s, texte: e.target.value })} />
            </Champ>
            <ChampLien value={s.bouton} onChange={(bouton) => maj({ ...s, bouton })} labelTexte="Texte du lien" />
          </div>
        );
      case "univers":
        return (
          <div className="grid grid-cols-2 gap-3">
            <Champ label="Titre">
              <Saisie value={s.titre} onChange={(e) => maj({ ...s, titre: e.target.value })} />
            </Champ>
            <Champ label="Mot en couleur">
              <Saisie value={s.titreAccent} onChange={(e) => maj({ ...s, titreAccent: e.target.value })} />
            </Champ>
          </div>
        );
      case "produits":
        return (
          <div className="space-y-3">
            <Champ label="Titre">
              <Saisie value={s.titre} onChange={(e) => maj({ ...s, titre: e.target.value })} />
            </Champ>
            <Champ label="Texte (facultatif)">
              <Zone value={s.texte} onChange={(e) => maj({ ...s, texte: e.target.value })} rows={2} />
            </Champ>
            <div className="grid gap-3 sm:grid-cols-2">
              <Champ label="Produits affichés">
                <Liste
                  value={s.mode}
                  onChange={(e) => maj({ ...s, mode: e.target.value as typeof s.mode })}
                  options={[
                    { value: "meilleures-ventes", label: "Meilleures ventes (automatique)" },
                    { value: "selection", label: "Ma sélection" },
                    { value: "univers", label: "Un univers" },
                    { value: "marque", label: "Une marque" },
                  ]}
                />
              </Champ>
              {s.mode !== "selection" && (
                <Champ label="Nombre de produits">
                  <SaisieNombre value={s.nombre} min={1} max={24} onChange={(n) => maj({ ...s, nombre: n })} />
                </Champ>
              )}
              {s.mode === "univers" && (
                <Champ label="Univers">
                  <Liste value={s.univers} onChange={(e) => maj({ ...s, univers: e.target.value })} options={[{ value: "", label: "Choisir…" }, ...univers.map((u) => ({ value: u.slug, label: u.nom }))]} />
                </Champ>
              )}
              {s.mode === "marque" && (
                <Champ label="Marque">
                  <Liste value={s.marque} onChange={(e) => maj({ ...s, marque: e.target.value })} options={[{ value: "", label: "Choisir…" }, ...marques.map((m) => ({ value: m, label: m }))]} />
                </Champ>
              )}
            </div>
            {s.mode === "selection" && (
              <Champ label="Produits (dans l'ordre)">
                <ChoixProduits produits={produits} valeur={s.produits} onChange={(v) => maj({ ...s, produits: v })} />
              </Champ>
            )}
            <ChampLien value={s.lien} onChange={(lien) => maj({ ...s, lien })} labelTexte="Lien « tout voir »" />
          </div>
        );
      case "familles":
        return (
          <ListeOrdonnee
            items={s.items}
            onChange={(items) => maj({ ...s, items })}
            nouveau={() => ({ titre: "", texte: "", produit: produits[0]?.slug ?? "" })}
            libelleAjout="Ajouter une famille"
            rendu={(it, set) => (
              <div className="space-y-3">
                <Champ label="Titre">
                  <Saisie value={it.titre} onChange={(e) => set({ ...it, titre: e.target.value })} />
                </Champ>
                <Champ label="Texte">
                  <Zone value={it.texte} onChange={(e) => set({ ...it, texte: e.target.value })} rows={2} />
                </Champ>
                <Champ label="Parfum mis en avant (sa couleur colore la section)">
                  <ChoixProduits produits={produits} valeur={it.produit ? [it.produit] : []} onChange={(v) => set({ ...it, produit: v[0] ?? "" })} multiple={false} />
                </Champ>
              </div>
            )}
          />
        );
      case "editorial":
        return (
          <div className="space-y-3">
            <Champ label="Titre">
              <Saisie value={s.titre} onChange={(e) => maj({ ...s, titre: e.target.value })} />
            </Champ>
            <Champ label="Texte">
              <Zone value={s.texte} onChange={(e) => maj({ ...s, texte: e.target.value })} rows={2} />
            </Champ>
            <ChampImage label="Image de fond" value={s.image} onChange={(image) => maj({ ...s, image })} />
            <ChampLien value={s.bouton} onChange={(bouton) => maj({ ...s, bouton })} labelTexte="Texte du bouton" />
          </div>
        );
      case "reassurance":
        return (
          <ListeOrdonnee
            items={s.items}
            onChange={(items) => maj({ ...s, items })}
            nouveau={() => ({ icone: "etoile", titre: "", texte: "" })}
            libelleAjout="Ajouter un engagement"
            rendu={(it, set) => (
              <div className="grid gap-3 sm:grid-cols-[auto_1fr_2fr]">
                <Champ label="Icône">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(ICONES).map(([nom, ic]) => (
                      <button key={nom} type="button" title={ic.nom} onClick={() => set({ ...it, icone: nom })} className={`grid size-9 place-items-center rounded-lg border ${it.icone === nom ? "border-bissap bg-bissap text-white" : "border-line bg-white"}`}>
                        <IconeNommee nom={nom} className="size-5" />
                      </button>
                    ))}
                  </div>
                </Champ>
                <Champ label="Chiffre / titre">
                  <Saisie value={it.titre} onChange={(e) => set({ ...it, titre: e.target.value })} />
                </Champ>
                <Champ label="Texte">
                  <Saisie value={it.texte} onChange={(e) => set({ ...it, texte: e.target.value })} />
                </Champ>
              </div>
            )}
          />
        );
    }
  };

  const maj = (i: number, s: Section) => b.setValeur(b.valeur.map((x, k) => (k === i ? s : x)));
  const deplacer = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= b.valeur.length) return;
    const copie = [...b.valeur];
    [copie[i], copie[j]] = [copie[j], copie[i]];
    b.setValeur(copie);
  };

  return (
    <>
      <ol className="space-y-3">
        {b.valeur.map((s, i) => {
          const def = typesSections.find((t) => t.type === s.type)!;
          const ouvert = ouverte === s.id;
          return (
            <li key={s.id} className={`rounded-2xl border bg-white transition ${ouvert ? "border-ink" : "border-line"} ${s.visible ? "" : "opacity-60"}`}>
              <div className="flex items-center gap-3 p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-creme text-sm font-bold">{i + 1}</span>
                <button className="min-w-0 flex-1 text-left" onClick={() => setOuverte(ouvert ? null : s.id)}>
                  <span className="block font-bold">{def.nom}</span>
                  <span className="block truncate text-sm text-muted">{resume(s) || def.description}</span>
                </button>
                <button onClick={() => maj(i, { ...s, visible: !s.visible })} className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:block ${s.visible ? "bg-sauge/15 text-sauge" : "bg-line text-muted"}`}>
                  {s.visible ? "Visible" : "Masquée"}
                </button>
                <div className="flex shrink-0">
                  <button onClick={() => deplacer(i, -1)} disabled={i === 0} className="grid size-9 place-items-center rounded-lg hover:bg-line disabled:opacity-30" aria-label="Monter">
                    ↑
                  </button>
                  <button onClick={() => deplacer(i, 1)} disabled={i === b.valeur.length - 1} className="grid size-9 place-items-center rounded-lg hover:bg-line disabled:opacity-30" aria-label="Descendre">
                    ↓
                  </button>
                  <button onClick={() => setOuverte(ouvert ? null : s.id)} className="grid size-9 place-items-center rounded-lg hover:bg-line" aria-label="Modifier">
                    {ouvert ? "▴" : "✎"}
                  </button>
                </div>
              </div>
              {ouvert && (
                <div className="border-t border-line p-4">
                  <div className="mb-4 sm:hidden">
                    <Interrupteur checked={s.visible} onChange={(visible) => maj(i, { ...s, visible })} label="Section visible" />
                  </div>
                  {editeur(s, (v) => maj(i, v))}
                  <div className="mt-5 flex justify-end border-t border-line pt-4">
                    <Bouton variante="danger" onClick={() => confirm("Supprimer cette section ?") && b.setValeur(b.valeur.filter((_, k) => k !== i))}>
                      Supprimer la section
                    </Bouton>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-4">
        {ajout ? (
          <div className="rounded-2xl border border-dashed border-ink bg-white p-4">
            <p className="mb-3 font-bold">Quelle section ajouter ?</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {typesSections.map((t) => (
                <button
                  key={t.type}
                  onClick={() => {
                    const s = sectionNeuve(t.type);
                    b.setValeur([...b.valeur, s]);
                    setOuverte(s.id);
                    setAjout(false);
                  }}
                  className="rounded-xl border border-line p-3 text-left hover:border-ink"
                >
                  <span className="block font-semibold">{t.nom}</span>
                  <span className="text-sm text-muted">{t.description}</span>
                </button>
              ))}
            </div>
            <Bouton variante="discret" className="mt-3" onClick={() => setAjout(false)}>
              Annuler
            </Bouton>
          </div>
        ) : (
          <Bouton variante="secondaire" onClick={() => setAjout(true)}>
            + Ajouter une section
          </Bouton>
        )}
      </div>

      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerReglages({ accueil: b.valeur }), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </>
  );
}
