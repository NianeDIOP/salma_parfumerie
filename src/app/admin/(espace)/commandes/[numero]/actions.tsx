"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton, Champ, Notification, Saisie, useAction, Zone } from "@/components/admin/ui";
import { changerStatut, majCommande, supprimerCommande } from "@/lib/actions/admin";
import { statuts, transitions, type Commande } from "@/lib/site";

const libelles: Record<string, string> = {
  payee: "Confirmer le paiement",
  preparation: "Commencer la préparation",
  expediee: "Remettre au livreur",
  livree: "Marquer comme livrée",
  annulee: "Annuler la commande",
  remboursee: "Rembourser",
};

// Processus de commande : chaque bouton fait passer à l'étape suivante possible.
export function ActionsCommande({ commande: c }: { commande: Commande }) {
  const router = useRouter();
  const { enCours, retour, lancer } = useAction();
  const [note, setNote] = useState("");
  const [livreur, setLivreur] = useState(c.livreur);
  const [notes, setNotes] = useState(c.notes);
  const suivantes = transitions[c.statut];

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="text-lg font-bold">Faire avancer la commande</h2>
      {suivantes.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Cette commande est terminée.</p>
      ) : (
        <>
          <Champ label="Note (facultatif)" className="mt-3">
            <Saisie value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : payé en espèces au livreur" />
          </Champ>
          <div className="mt-3 grid gap-2">
            {suivantes.map((s) => {
              const def = statuts.find((x) => x.id === s)!;
              const negatif = s === "annulee" || s === "remboursee";
              return (
                <Bouton
                  key={s}
                  variante={negatif ? "danger" : "principal"}
                  disabled={enCours}
                  onClick={() => {
                    if (negatif && !confirm(`${libelles[s]} ? Le stock réservé sera remis en vente.`)) return;
                    lancer(() => changerStatut(c.numero, s, note), () => setNote(""));
                  }}
                  className="w-full py-3"
                  style={negatif ? undefined : { background: def.couleur }}
                >
                  {libelles[s] ?? def.label}
                </Bouton>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-6 space-y-3 border-t border-line pt-5">
        <Champ label="Livreur">
          <Saisie value={livreur} onChange={(e) => setLivreur(e.target.value)} placeholder="Nom et téléphone du livreur" />
        </Champ>
        <Champ label="Notes internes">
          <Zone value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Visibles uniquement par l'équipe" />
        </Champ>
        <div className="flex flex-wrap gap-2">
          <Bouton variante="secondaire" disabled={enCours || (livreur === c.livreur && notes === c.notes)} onClick={() => lancer(() => majCommande(c.numero, { livreur, notes }))}>
            Enregistrer
          </Bouton>
          <Bouton variante="discret" onClick={() => window.print()}>
            Imprimer
          </Bouton>
          <a href={`/commande/${c.numero}`} target="_blank" className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink">
            Page de suivi client ↗
          </a>
          <Bouton
            variante="discret"
            className="ml-auto text-bissap"
            onClick={() => {
              if (confirm("Supprimer définitivement cette commande ?")) lancer(() => supprimerCommande(c.numero), (r) => r.ok && router.push("/admin/commandes"));
            }}
          >
            Supprimer
          </Bouton>
        </div>
      </div>
      <Notification retour={retour} />
    </section>
  );
}
