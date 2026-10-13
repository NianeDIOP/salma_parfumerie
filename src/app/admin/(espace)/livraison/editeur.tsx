"use client";

import { BarreEnregistrer, Carte, Champ, Interrupteur, ListeOrdonnee, Notification, Saisie, SaisieNombre, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { enregistrerReglages } from "@/lib/actions/admin";
import { moyensPaiement, nouvelId, type Reglages } from "@/lib/site";

export function EditeurLivraison(props: Pick<Reglages, "livraison" | "paiements" | "boutique">) {
  const b = useBrouillon(props);
  const v = b.valeur;
  const { enCours, retour, lancer } = useAction();
  return (
    <div className="space-y-3">
      <Carte titre="Zones de livraison" icone="livraison" description="Proposées au client lors de la commande">
        <ListeOrdonnee
          items={v.livraison.zones}
          onChange={(zones) => b.setValeur({ ...v, livraison: { ...v.livraison, zones } })}
          libelleAjout="Ajouter une zone"
          nouveau={() => ({ id: nouvelId("zone"), label: "", delai: "", frais: 0, gratuiteDes: null, actif: true })}
          rendu={(z, maj) => (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1fr_auto] lg:items-end">
              <Champ label="Zone">
                <Saisie value={z.label} onChange={(e) => maj({ ...z, label: e.target.value })} placeholder="Dakar & banlieue" />
              </Champ>
              <Champ label="Délai">
                <Saisie value={z.delai} onChange={(e) => maj({ ...z, delai: e.target.value })} placeholder="24 h" />
              </Champ>
              <Champ label="Frais (F)">
                <SaisieNombre value={z.frais} min={0} step={500} onChange={(n) => maj({ ...z, frais: n })} />
              </Champ>
              <Champ label="Offerte dès (F)" aide="0 = jamais offerte">
                <SaisieNombre value={z.gratuiteDes ?? 0} min={0} step={1000} onChange={(n) => maj({ ...z, gratuiteDes: n > 0 ? n : null })} />
              </Champ>
              <div className="pb-1">
                <Interrupteur checked={z.actif} onChange={(actif) => maj({ ...z, actif })} label="Active" />
              </div>
            </div>
          )}
        />
      </Carte>

      <Carte titre="Moyens de paiement" icone="carte">
        <div className="divide-y divide-line">
          {moyensPaiement.map((m) => (
            <Interrupteur key={m.id} checked={v.paiements[m.id]} onChange={(on) => b.setValeur({ ...v, paiements: { ...v.paiements, [m.id]: on } })} label={m.label} aide={m.detail} />
          ))}
        </div>
      </Carte>

      <Carte titre="Options de commande" icone="parametres">
        <Interrupteur checked={v.livraison.echantillonOffert} onChange={(echantillonOffert) => b.setValeur({ ...v, livraison: { ...v.livraison, echantillonOffert } })} label="Échantillon offert au choix" />
        <Interrupteur checked={v.boutique.paiementEnPlusieursFois} onChange={(paiementEnPlusieursFois) => b.setValeur({ ...v, boutique: { ...v.boutique, paiementEnPlusieursFois } })} label="Afficher « ou 3 × … » sur les fiches produit" />
        <div className="mt-3 grid gap-3">
          <Champ label="Message après commande">
            <Zone value={v.boutique.messageConfirmation} onChange={(e) => b.setValeur({ ...v, boutique: { ...v.boutique, messageConfirmation: e.target.value } })} rows={2} />
          </Champ>
          <Champ label="Texte du panier vide">
            <Saisie value={v.boutique.texteVide} onChange={(e) => b.setValeur({ ...v, boutique: { ...v.boutique, texteVide: e.target.value } })} />
          </Champ>
        </div>
      </Carte>

      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerReglages(v), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </div>
  );
}
