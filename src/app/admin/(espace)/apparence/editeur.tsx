"use client";

import { useState } from "react";
import { BarreEnregistrer, Bouton, Carte, Champ, ChampLien, Couleur, Interrupteur, Liste, ListeOrdonnee, Notification, Saisie, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { enregistrerReglages } from "@/lib/actions/admin";
import { reglagesParDefaut } from "@/lib/seed";
import { polices, type Couleurs, type Lien, type Police, type Reglages } from "@/lib/site";

type Valeur = Pick<Reglages, "identite" | "entete" | "pied" | "mobile">;

const onglets = [
  { id: "identite", label: "Identité & couleurs" },
  { id: "entete", label: "En-tête" },
  { id: "pied", label: "Pied de page" },
  { id: "mobile", label: "Barre mobile" },
] as const;

const nomsCouleurs: Record<keyof Couleurs, string> = {
  primaire: "Couleur principale (boutons, accents)",
  primaireFonce: "Principale foncée (survol)",
  secondaire: "Couleur secondaire",
  accent: "Accent doux",
  fond: "Fond du site",
  fondClair: "Fond clair (cartes)",
  texte: "Texte",
  texteDoux: "Texte secondaire",
  ligne: "Lignes et bordures",
};

const nouveauLien = (): Lien => ({ label: "", href: "/" });

export function EditeurApparence(initial: Valeur) {
  const b = useBrouillon<Valeur>(initial);
  const v = b.valeur;
  const [onglet, setOnglet] = useState<(typeof onglets)[number]["id"]>("identite");
  const { enCours, retour, lancer } = useAction();
  const setIdentite = (x: Partial<Valeur["identite"]>) => b.setValeur({ ...v, identite: { ...v.identite, ...x } });
  const setEntete = (x: Partial<Valeur["entete"]>) => b.setValeur({ ...v, entete: { ...v.entete, ...x } });
  const setPied = (x: Partial<Valeur["pied"]>) => b.setValeur({ ...v, pied: { ...v.pied, ...x } });
  const c = v.identite.couleurs;

  return (
    <>
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {onglets.map((o) => (
          <button key={o.id} onClick={() => setOnglet(o.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${onglet === o.id ? "bg-ink text-white" : "border border-line bg-white"}`}>
            {o.label}
          </button>
        ))}
      </div>

      {onglet === "identite" && (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4">
            <Carte titre="Identité">
              <div className="grid gap-3 sm:grid-cols-2">
                <Champ label="Logo (texte)">
                  <Saisie value={v.identite.logo} onChange={(e) => setIdentite({ logo: e.target.value })} />
                </Champ>
                <Champ label="Sous-titre du logo">
                  <Saisie value={v.identite.sousTitre} onChange={(e) => setIdentite({ sousTitre: e.target.value })} />
                </Champ>
                <Champ label="Nom complet">
                  <Saisie value={v.identite.nom} onChange={(e) => setIdentite({ nom: e.target.value })} />
                </Champ>
                <Champ label="Slogan">
                  <Saisie value={v.identite.slogan} onChange={(e) => setIdentite({ slogan: e.target.value })} />
                </Champ>
              </div>
              <Champ label="Police du site" className="mt-3">
                <Liste value={v.identite.police} onChange={(e) => setIdentite({ police: e.target.value as Police })} options={polices.map((p) => ({ value: p.id, label: p.nom }))} />
              </Champ>
            </Carte>
            <Carte
              titre="Couleurs"
              actions={
                <Bouton variante="discret" onClick={() => setIdentite({ couleurs: reglagesParDefaut.identite.couleurs })}>
                  Couleurs d&apos;origine
                </Bouton>
              }
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(nomsCouleurs) as (keyof Couleurs)[]).map((k) => (
                  <Couleur key={k} label={nomsCouleurs[k]} value={c[k]} onChange={(val) => setIdentite({ couleurs: { ...c, [k]: val } })} />
                ))}
              </div>
            </Carte>
            <Carte titre="Effets">
              <Interrupteur checked={v.identite.curseur} onChange={(curseur) => setIdentite({ curseur })} label="Curseur signature (ordinateur)" />
              <Interrupteur checked={v.identite.transitionPages} onChange={(transitionPages) => setIdentite({ transitionPages })} label="Rideau de transition entre les pages" />
            </Carte>
          </div>
          {/* Aperçu */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="mb-2 text-sm font-semibold text-muted">Aperçu</p>
            <div className="overflow-hidden rounded-2xl border border-line shadow-sm" style={{ background: c.fond, color: c.texte }}>
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: c.ligne }}>
                <span className="text-xl font-extrabold">
                  {v.identite.logo} <span className="text-xs font-normal" style={{ color: c.texteDoux }}>{v.identite.sousTitre}</span>
                </span>
                <span className="rounded-full px-3 py-1 text-xs" style={{ background: c.accent, color: c.primaire }}>
                  {v.entete.bouton.label}
                </span>
              </div>
              <div className="p-5" style={{ background: c.primaire, color: "#fff" }}>
                <p className="text-3xl font-extrabold">Titre du hero</p>
                <p className="text-sm opacity-80">{v.identite.slogan}</p>
              </div>
              <div className="space-y-3 p-5">
                <div className="rounded-xl p-4" style={{ background: c.fondClair }}>
                  <p className="font-bold">Carte produit</p>
                  <p className="text-sm" style={{ color: c.texteDoux }}>
                    Texte secondaire
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: c.texte }}>
                    Bouton
                  </span>
                  <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: c.secondaire }}>
                    Secondaire
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {onglet === "entete" && (
        <div className="space-y-4">
          <Carte titre="Menu principal" description="Liens affichés dans l'en-tête sur ordinateur.">
            <ListeOrdonnee items={v.entete.liens} onChange={(liens) => setEntete({ liens })} nouveau={nouveauLien} libelleAjout="Ajouter un lien" rendu={(l, maj) => <ChampLien value={l} onChange={maj} />} />
          </Carte>
          <Carte titre="Bouton mis en avant">
            <Interrupteur checked={v.entete.bouton.visible} onChange={(visible) => setEntete({ bouton: { ...v.entete.bouton, visible } })} label="Afficher le bouton" />
            <div className="mt-3">
              <ChampLien value={v.entete.bouton} onChange={(l) => setEntete({ bouton: { ...v.entete.bouton, ...l } })} />
            </div>
          </Carte>
          <Carte titre="Icônes">
            <Interrupteur checked={v.entete.afficherCompte} onChange={(afficherCompte) => setEntete({ afficherCompte })} label="Icône « Mon compte »" />
            <Interrupteur checked={v.entete.afficherFavoris} onChange={(afficherFavoris) => setEntete({ afficherFavoris })} label="Icône « Favoris »" />
          </Carte>
        </div>
      )}

      {onglet === "pied" && (
        <div className="space-y-4">
          <Carte titre="Présentation">
            <Champ label="Texte de présentation">
              <Zone value={v.pied.description} onChange={(e) => setPied({ description: e.target.value })} rows={2} />
            </Champ>
            <Champ label="Mention de bas de page" className="mt-3">
              <Saisie value={v.pied.copyright} onChange={(e) => setPied({ copyright: e.target.value })} />
            </Champ>
            <div className="mt-3">
              <Interrupteur checked={v.pied.grandLogo} onChange={(grandLogo) => setPied({ grandLogo })} label="Grand logo en bas de page" />
            </div>
          </Carte>
          <Carte titre="Colonnes de liens">
            <ListeOrdonnee
              items={v.pied.colonnes}
              onChange={(colonnes) => setPied({ colonnes })}
              libelleAjout="Ajouter une colonne"
              nouveau={() => ({ titre: "Nouvelle colonne", liens: [] })}
              rendu={(col, maj) => (
                <div className="space-y-3">
                  <Champ label="Titre de la colonne">
                    <Saisie value={col.titre} onChange={(e) => maj({ ...col, titre: e.target.value })} />
                  </Champ>
                  <ListeOrdonnee items={col.liens} onChange={(liens) => maj({ ...col, liens })} nouveau={nouveauLien} libelleAjout="Ajouter un lien" rendu={(l, majLien) => <ChampLien value={l} onChange={majLien} />} />
                </div>
              )}
            />
          </Carte>
          <Carte titre="Newsletter">
            <Interrupteur checked={v.pied.newsletter.visible} onChange={(visible) => setPied({ newsletter: { ...v.pied.newsletter, visible } })} label="Afficher l'inscription" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Champ label="Texte du champ">
                <Saisie value={v.pied.newsletter.placeholder} onChange={(e) => setPied({ newsletter: { ...v.pied.newsletter, placeholder: e.target.value } })} />
              </Champ>
              <Champ label="Bouton">
                <Saisie value={v.pied.newsletter.bouton} onChange={(e) => setPied({ newsletter: { ...v.pied.newsletter, bouton: e.target.value } })} />
              </Champ>
            </div>
          </Carte>
          <Carte titre="Logos de paiement affichés">
            <ListeOrdonnee items={v.pied.paiements} onChange={(paiements) => setPied({ paiements })} nouveau={() => ""} libelleAjout="Ajouter" rendu={(p, maj) => <Saisie value={p} onChange={(e) => maj(e.target.value)} />} />
          </Carte>
        </div>
      )}

      {onglet === "mobile" && (
        <Carte titre="Barre d'onglets (mobile)" description="Libellés des 5 onglets en bas de l'écran sur téléphone.">
          <div className="grid gap-3 sm:grid-cols-5">
            {(Object.keys(v.mobile.onglets) as (keyof Reglages["mobile"]["onglets"])[]).map((k) => (
              <Champ key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                <Saisie value={v.mobile.onglets[k]} onChange={(e) => b.setValeur({ ...v, mobile: { onglets: { ...v.mobile.onglets, [k]: e.target.value } } })} />
              </Champ>
            ))}
          </div>
        </Carte>
      )}

      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerReglages(v), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </>
  );
}
