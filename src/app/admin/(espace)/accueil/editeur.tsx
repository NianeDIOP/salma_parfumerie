"use client";

import { Icone, PastilleIcone, type NomIcone } from "@/components/admin/icones";
import { useState } from "react";
import { BarreEnregistrer, Bouton, Champ, ChampImage, ChampLien, ChoixProduits, Interrupteur, Liste, ListeOrdonnee, Notification, Saisie, SaisieNombre, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { ICONES, IconeNommee } from "@/components/icon-set";
import { enregistrerReglages } from "@/lib/actions/admin";
import type { Produit, Univers } from "@/lib/catalogue";
import { nouvelId, typesSections, type Section } from "@/lib/site";

const ICONES_SECTIONS: Record<Section["type"], NomIcone> = {
  hero: "image",
  pastilles: "univers",
  marques: "texte",
  manifeste: "texte",
  univers: "calques",
  produits: "produits",
  familles: "fleur",
  editorial: "image",
  reassurance: "check",
};

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
            <p className="text-[11px] text-muted">Les couleurs de fond viennent de chaque produit (Produits › Couleurs du produit).</p>
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
                      <button key={nom} type="button" title={ic.nom} onClick={() => set({ ...it, icone: nom })} className={`grid size-7 place-items-center rounded-md border ${it.icone === nom ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
                        <IconeNommee nom={nom} className="size-4" />
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
      <ol className="space-y-1.5">
        {b.valeur.map((s, i) => {
          const def = typesSections.find((t) => t.type === s.type)!;
          const ouvert = ouverte === s.id;
          return (
            <li key={s.id} className={`rounded-xl border bg-white transition ${ouvert ? "border-ink/40 shadow-sm" : "border-line"} ${s.visible ? "" : "opacity-55"}`}>
              <div className="flex items-center gap-2.5 px-3 py-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-creme text-[11px] font-semibold text-muted">{i + 1}</span>
                <PastilleIcone nom={ICONES_SECTIONS[s.type]} ton="gris" taille="sm" />
                <button className="min-w-0 flex-1 text-left" onClick={() => setOuverte(ouvert ? null : s.id)}>
                  <span className="block text-[13px] font-medium leading-tight">{def.nom}</span>
                  <span className="block truncate text-[11px] text-muted">{resume(s) || def.description}</span>
                </button>
                <button onClick={() => maj(i, { ...s, visible: !s.visible })} className={`hidden h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium sm:inline-flex ${s.visible ? "bg-[#2f8f5b]/10 text-[#2f8f5b]" : "bg-ink/5 text-muted"}`} title="Afficher / masquer">
                  <Icone nom="oeil" className="size-3.5" />
                  {s.visible ? "Visible" : "Masquée"}
                </button>
                <div className="flex shrink-0">
                  <button onClick={() => deplacer(i, -1)} disabled={i === 0} className="grid size-7 place-items-center rounded-md text-muted hover:bg-ink/5 hover:text-ink disabled:opacity-25" aria-label="Monter">
                    <Icone nom="haut" className="size-4" />
                  </button>
                  <button onClick={() => deplacer(i, 1)} disabled={i === b.valeur.length - 1} className="grid size-7 place-items-center rounded-md text-muted hover:bg-ink/5 hover:text-ink disabled:opacity-25" aria-label="Descendre">
                    <Icone nom="bas" className="size-4" />
                  </button>
                  <button onClick={() => setOuverte(ouvert ? null : s.id)} className={`grid size-7 place-items-center rounded-md hover:bg-ink/5 ${ouvert ? "bg-ink text-white hover:bg-ink" : "text-muted hover:text-ink"}`} aria-label="Modifier">
                    <Icone nom={ouvert ? "haut" : "crayon"} className="size-3.5" />
                  </button>
                </div>
              </div>
              {ouvert && (
                <div className="space-y-3 border-t border-line p-3">
                  <div className="sm:hidden">
                    <Interrupteur checked={s.visible} onChange={(visible) => maj(i, { ...s, visible })} label="Section visible" />
                  </div>
                  {editeur(s, (v) => maj(i, v))}
                  <div className="flex justify-end border-t border-line pt-3">
                    <Bouton variante="danger" icone="poubelle" onClick={() => confirm("Supprimer cette section ?") && b.setValeur(b.valeur.filter((_, k) => k !== i))}>
                      Supprimer la section
                    </Bouton>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-3">
        {ajout ? (
          <div className="rounded-xl border border-dashed border-ink/40 bg-white p-3">
            <p className="mb-2.5 text-[13px] font-semibold">Quelle section ajouter ?</p>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {typesSections.map((t) => (
                <button
                  key={t.type}
                  onClick={() => {
                    const s = sectionNeuve(t.type);
                    b.setValeur([...b.valeur, s]);
                    setOuverte(s.id);
                    setAjout(false);
                  }}
                  className="flex items-start gap-2.5 rounded-lg border border-line p-2.5 text-left hover:border-ink/40 hover:bg-creme-light"
                >
                  <PastilleIcone nom={ICONES_SECTIONS[t.type]} ton="rouge" taille="sm" />
                  <span>
                    <span className="block text-[13px] font-medium">{t.nom}</span>
                    <span className="text-[11px] leading-snug text-muted">{t.description}</span>
                  </span>
                </button>
              ))}
            </div>
            <Bouton variante="discret" className="mt-2" onClick={() => setAjout(false)}>
              Annuler
            </Bouton>
          </div>
        ) : (
          <Bouton variante="secondaire" icone="plus" onClick={() => setAjout(true)}>
            Ajouter une section
          </Bouton>
        )}
      </div>

      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerReglages({ accueil: b.valeur }), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </>
  );
}
