"use client";

import { BarreEnregistrer, Champ, Interrupteur, Liste, ListeOrdonnee, Notification, Saisie, SaisieNombre, useAction, useBrouillon } from "@/components/admin/ui";
import { enregistrerCodes } from "@/lib/actions/admin";
import type { CodePromo } from "@/lib/site";

export function EditeurCodes({ codes }: { codes: CodePromo[] }) {
  const b = useBrouillon(codes);
  const { enCours, retour, lancer } = useAction();
  return (
    <>
      <ListeOrdonnee
        items={b.valeur}
        onChange={b.setValeur}
        libelleAjout="Nouveau code"
        vide="Aucun code promo."
        nouveau={(): CodePromo => ({ code: "", type: "pourcentage", valeur: 10, actif: true, minimum: 0, utilisations: 0 })}
        rendu={(c, maj) => (
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_0.8fr_1fr_auto] sm:items-end">
            <Champ label="Code">
              <Saisie value={c.code} onChange={(e) => maj({ ...c, code: e.target.value.toUpperCase() })} placeholder="TABASKI15" className="font-bold tracking-wider" />
            </Champ>
            <Champ label="Type">
              <Liste value={c.type} onChange={(e) => maj({ ...c, type: e.target.value as CodePromo["type"] })} options={[{ value: "pourcentage", label: "Pourcentage (%)" }, { value: "montant", label: "Montant (FCFA)" }]} />
            </Champ>
            <Champ label={c.type === "pourcentage" ? "Remise %" : "Remise F"}>
              <SaisieNombre value={c.valeur} min={0} onChange={(n) => maj({ ...c, valeur: n })} />
            </Champ>
            <Champ label="Achat minimum" aide={`Utilisé ${c.utilisations} fois`}>
              <SaisieNombre value={c.minimum} min={0} step={1000} onChange={(n) => maj({ ...c, minimum: n })} />
            </Champ>
            <div className="pb-1">
              <Interrupteur checked={c.actif} onChange={(actif) => maj({ ...c, actif })} label="Actif" />
            </div>
          </div>
        )}
      />
      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerCodes(b.valeur), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </>
  );
}
