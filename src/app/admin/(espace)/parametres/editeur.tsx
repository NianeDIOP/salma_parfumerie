"use client";

import { useState } from "react";
import { BarreEnregistrer, Bouton, Carte, Champ, Notification, Saisie, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { ajouterAdmin, changerMotDePasse, enregistrerReglages, supprimerAdmin } from "@/lib/actions/admin";
import type { Reglages } from "@/lib/site";

export function Parametres({ contact, seo, admins, moi }: Pick<Reglages, "contact" | "seo"> & { admins: { email: string; nom: string }[]; moi: string }) {
  const b = useBrouillon({ contact, seo });
  const v = b.valeur;
  const { enCours, retour, lancer } = useAction();
  const [nouvel, setNouvel] = useState({ email: "", nom: "", motDePasse: "" });
  const [mdp, setMdp] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const setContact = (x: Partial<Reglages["contact"]>) => b.setValeur({ ...v, contact: { ...v.contact, ...x } });

  return (
    <div className="space-y-4">
      <Carte titre="Coordonnées" description="Utilisées pour le bouton « Conseillère WhatsApp » et les pages du site.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Champ label="Numéro WhatsApp" aide="Avec l'indicatif, sans + ni espaces : 221775665335">
            <Saisie value={v.contact.whatsapp} onChange={(e) => setContact({ whatsapp: e.target.value })} />
          </Champ>
          <Champ label="Téléphone affiché">
            <Saisie value={v.contact.telephone} onChange={(e) => setContact({ telephone: e.target.value })} />
          </Champ>
          <Champ label="E-mail">
            <Saisie value={v.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
          </Champ>
          <Champ label="Adresse">
            <Saisie value={v.contact.adresse} onChange={(e) => setContact({ adresse: e.target.value })} />
          </Champ>
          <Champ label="Horaires" className="sm:col-span-2">
            <Saisie value={v.contact.horaires} onChange={(e) => setContact({ horaires: e.target.value })} />
          </Champ>
        </div>
      </Carte>

      <Carte titre="Référencement (Google, partage WhatsApp)">
        <Champ label="Titre du site">
          <Saisie value={v.seo.titre} onChange={(e) => b.setValeur({ ...v, seo: { ...v.seo, titre: e.target.value } })} />
        </Champ>
        <Champ label="Description" className="mt-3" aide={`${v.seo.description.length} caractères (idéal : 120 à 160)`}>
          <Zone value={v.seo.description} onChange={(e) => b.setValeur({ ...v, seo: { ...v.seo, description: e.target.value } })} rows={3} />
        </Champ>
      </Carte>

      <div id="securite" className="grid gap-4 lg:grid-cols-2">
        <Carte titre="Changer mon mot de passe">
          <div className="space-y-3">
            <Champ label="Mot de passe actuel">
              <Saisie type="password" value={mdp.actuel} onChange={(e) => setMdp({ ...mdp, actuel: e.target.value })} autoComplete="current-password" />
            </Champ>
            <Champ label="Nouveau mot de passe" aide="8 caractères minimum">
              <Saisie type="password" value={mdp.nouveau} onChange={(e) => setMdp({ ...mdp, nouveau: e.target.value })} autoComplete="new-password" />
            </Champ>
            <Champ label="Confirmation">
              <Saisie type="password" value={mdp.confirmation} onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })} autoComplete="new-password" />
            </Champ>
            {mdp.confirmation && mdp.confirmation !== mdp.nouveau && <p className="text-sm text-bissap">Les deux mots de passe ne correspondent pas.</p>}
            <Bouton disabled={enCours || !mdp.actuel || mdp.nouveau.length < 8 || mdp.nouveau !== mdp.confirmation} onClick={() => lancer(() => changerMotDePasse(mdp.actuel, mdp.nouveau), (r) => r.ok && setMdp({ actuel: "", nouveau: "", confirmation: "" }))}>
              Modifier le mot de passe
            </Bouton>
          </div>
        </Carte>

        <Carte titre="Administrateurs" description="Seules ces personnes peuvent se connecter à la gestion du site.">
          <ul className="divide-y divide-line">
            {admins.map((a) => (
              <li key={a.email} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {a.nom} {a.email === moi && <span className="text-sm font-normal text-muted">(vous)</span>}
                  </span>
                  <span className="block truncate text-sm text-muted">{a.email}</span>
                </span>
                {a.email !== moi && (
                  <Bouton variante="discret" className="text-bissap" onClick={() => confirm(`Retirer l'accès de ${a.email} ?`) && lancer(() => supprimerAdmin(a.email))}>
                    Retirer
                  </Bouton>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <p className="font-semibold">Ajouter un administrateur</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Saisie placeholder="Nom" value={nouvel.nom} onChange={(e) => setNouvel({ ...nouvel, nom: e.target.value })} />
              <Saisie placeholder="E-mail" type="email" value={nouvel.email} onChange={(e) => setNouvel({ ...nouvel, email: e.target.value })} />
            </div>
            <Saisie placeholder="Mot de passe provisoire (8 caractères min.)" type="password" value={nouvel.motDePasse} onChange={(e) => setNouvel({ ...nouvel, motDePasse: e.target.value })} autoComplete="new-password" />
            <Bouton variante="secondaire" disabled={enCours || !nouvel.email || nouvel.motDePasse.length < 8} onClick={() => lancer(() => ajouterAdmin(nouvel.email, nouvel.nom, nouvel.motDePasse), (r) => r.ok && setNouvel({ email: "", nom: "", motDePasse: "" }))}>
              Ajouter
            </Bouton>
          </div>
        </Carte>
      </div>

      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerReglages(v), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </div>
  );
}
