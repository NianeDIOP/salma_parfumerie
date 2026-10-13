"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icone, type NomIcone } from "@/components/admin/icones";
import { Bouton, Carte, Champ, Notification, Saisie, useAction, Zone } from "@/components/admin/ui";
import { changerStatut, majCommande, supprimerCommande } from "@/lib/actions/admin";
import { statuts, transitions, type Commande } from "@/lib/site";

const icones: Record<string, NomIcone> = { payee: "argent", preparation: "produits", expediee: "livraison", livree: "check", annulee: "croix", remboursee: "retour" };

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
    <Carte titre="Étape suivante" icone="tendance">
      {suivantes.length === 0 ? (
        <p className="flex items-center gap-2 text-xs text-muted">
          <Icone nom="check" className="size-4 text-[#2f8f5b]" /> Cette commande est terminée.
        </p>
      ) : (
        <>
          <Champ label="Note (facultatif)">
            <Saisie value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. : payé en espèces au livreur" />
          </Champ>
          <div className="mt-2.5 grid gap-1.5">
            {suivantes.map((s) => {
              const def = statuts.find((x) => x.id === s)!;
              const negatif = s === "annulee" || s === "remboursee";
              return (
                <Bouton
                  key={s}
                  icone={icones[s]}
                  variante={negatif ? "danger" : "principal"}
                  disabled={enCours}
                  onClick={() => {
                    if (negatif && !confirm(`${libelles[s]} ? Le stock réservé sera remis en vente.`)) return;
                    lancer(() => changerStatut(c.numero, s, note), () => setNote(""));
                  }}
                  className="w-full"
                  style={negatif ? undefined : { background: def.couleur }}
                >
                  {libelles[s] ?? def.label}
                </Bouton>
              );
            })}
          </div>
        </>
      )}

      <div className="-mx-4 mt-4 space-y-2.5 border-t border-line px-4 pt-3.5">
        <Champ label="Livreur">
          <Saisie value={livreur} onChange={(e) => setLivreur(e.target.value)} placeholder="Nom et téléphone du livreur" />
        </Champ>
        <Champ label="Notes internes">
          <Zone value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Visibles uniquement par l'équipe" />
        </Champ>
        <div className="flex flex-wrap items-center gap-1.5">
          <Bouton variante="secondaire" icone="check" disabled={enCours || (livreur === c.livreur && notes === c.notes)} onClick={() => lancer(() => majCommande(c.numero, { livreur, notes }))}>
            Enregistrer
          </Bouton>
          <Bouton variante="discret" icone="imprimer" onClick={() => window.print()} aria-label="Imprimer" title="Imprimer" className="px-2.5" />
          <a href={`/commande/${c.numero}`} target="_blank" className="grid size-9 place-items-center rounded-lg text-ink/70 hover:bg-ink/5" title="Page de suivi client" aria-label="Page de suivi client">
            <Icone nom="oeil" />
          </a>
          <Bouton
            variante="discret"
            icone="poubelle"
            title="Supprimer"
            aria-label="Supprimer"
            className="ml-auto px-2.5 text-[#c0392b]"
            onClick={() => {
              if (confirm("Supprimer définitivement cette commande ?")) lancer(() => supprimerCommande(c.numero), (r) => r.ok && router.push("/admin/commandes"));
            }}
          />
        </div>
      </div>
      <Notification retour={retour} />
    </Carte>
  );
}
