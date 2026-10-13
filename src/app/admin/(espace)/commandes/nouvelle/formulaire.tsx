"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton, Carte, Champ, ChoixProduits, Interrupteur, Liste, Notification, Saisie, SaisieNombre, useAction, Zone } from "@/components/admin/ui";
import { creerVente } from "@/lib/actions/admin";
import { formatFCFA, type Produit } from "@/lib/catalogue";
import { moyensPaiement, type MoyenPaiement, type ZoneLivraison } from "@/lib/site";

interface Ligne {
  slug: string;
  contenance: string;
  quantite: number;
}

export function NouvelleVente({ produits, zones }: { produits: Produit[]; zones: ZoneLivraison[] }) {
  const router = useRouter();
  const { enCours, retour, lancer } = useAction();
  const [canal, setCanal] = useState<"boutique" | "whatsapp">("boutique");
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [client, setClient] = useState({ nom: "", telephone: "", adresse: "", repere: "" });
  const [zone, setZone] = useState("boutique");
  const [moyen, setMoyen] = useState<MoyenPaiement>("wave");
  const [remise, setRemise] = useState(0);
  const [payee, setPayee] = useState(true);
  const [notes, setNotes] = useState("");

  const trouver = (slug: string) => produits.find((p) => p.slug === slug);
  const sousTotal = lignes.reduce((n, l) => n + (trouver(l.slug)?.contenances.find((c) => c.label === l.contenance)?.prix ?? 0) * l.quantite, 0);
  const frais = zone === "boutique" ? 0 : (zones.find((z) => z.id === zone)?.frais ?? 0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        <Carte titre="Produits">
          <ChoixProduits
            produits={produits}
            valeur={[]}
            onChange={(v) => {
              const p = trouver(v[0]);
              if (p) setLignes([...lignes, { slug: p.slug, contenance: p.contenances[0].label, quantite: 1 }]);
            }}
          />
          <ul className="mt-4 divide-y divide-line">
            {lignes.map((l, i) => {
              const p = trouver(l.slug)!;
              const c = p.contenances.find((x) => x.label === l.contenance)!;
              const maj = (v: Partial<Ligne>) => setLignes(lignes.map((x, k) => (k === i ? { ...x, ...v } : x)));
              return (
                <li key={i} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="min-w-0 flex-1 font-semibold">
                    {p.marque} {p.nom}
                  </span>
                  <Liste value={l.contenance} onChange={(e) => maj({ contenance: e.target.value })} options={p.contenances.map((x) => ({ value: x.label, label: `${x.label} · ${formatFCFA(x.prix)} F (stock ${x.stock})` }))} className="w-auto" />
                  <SaisieNombre value={l.quantite} min={1} max={c.stock} onChange={(n) => maj({ quantite: Math.max(1, n) })} className="w-20" />
                  <span className="w-24 text-right tabular-nums">{formatFCFA(c.prix * l.quantite)} F</span>
                  <button onClick={() => setLignes(lignes.filter((_, k) => k !== i))} className="text-bissap" aria-label="Retirer">
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </Carte>

        <Carte titre="Client">
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Nom">
              <Saisie value={client.nom} onChange={(e) => setClient({ ...client, nom: e.target.value })} />
            </Champ>
            <Champ label="Téléphone">
              <Saisie value={client.telephone} onChange={(e) => setClient({ ...client, telephone: e.target.value })} />
            </Champ>
            <Champ label="Adresse">
              <Saisie value={client.adresse} onChange={(e) => setClient({ ...client, adresse: e.target.value })} />
            </Champ>
            <Champ label="Point de repère">
              <Saisie value={client.repere} onChange={(e) => setClient({ ...client, repere: e.target.value })} />
            </Champ>
          </div>
        </Carte>
      </div>

      <div className="space-y-4">
        <Carte titre="Vente">
          <div className="space-y-3">
            <Champ label="Canal">
              <Liste value={canal} onChange={(e) => setCanal(e.target.value as "boutique" | "whatsapp")} options={[{ value: "boutique", label: "Vente en boutique" }, { value: "whatsapp", label: "Commande WhatsApp" }]} />
            </Champ>
            <Champ label="Livraison">
              <Liste value={zone} onChange={(e) => setZone(e.target.value)} options={[{ value: "boutique", label: "Remis en boutique" }, ...zones.filter((z) => z.id !== "boutique").map((z) => ({ value: z.id, label: `${z.label} · ${formatFCFA(z.frais)} F` }))]} />
            </Champ>
            <Champ label="Paiement">
              <Liste value={moyen} onChange={(e) => setMoyen(e.target.value as MoyenPaiement)} options={moyensPaiement.map((m) => ({ value: m.id, label: m.label }))} />
            </Champ>
            <Champ label="Remise (FCFA)">
              <SaisieNombre value={remise} min={0} onChange={setRemise} />
            </Champ>
            <Interrupteur checked={payee} onChange={setPayee} label="Déjà encaissée" />
            <Champ label="Notes">
              <Zone value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </Champ>
          </div>
          <dl className="mt-5 space-y-1 border-t border-line pt-4">
            <div className="flex justify-between text-sm">
              <dt className="text-muted">Sous-total</dt>
              <dd>{formatFCFA(sousTotal)} F</dd>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <dt>Total</dt>
              <dd>{formatFCFA(Math.max(0, sousTotal - remise) + frais)} F</dd>
            </div>
          </dl>
          <Bouton
            className="mt-4 w-full py-3.5"
            disabled={enCours || !lignes.length || !client.nom}
            onClick={() => lancer(() => creerVente({ canal, client, lignes, zone, moyen, remise, payee, notes }), (r) => r.ok && "numero" in r && router.push(`/admin/commandes/${r.numero}`))}
          >
            {enCours ? "Enregistrement…" : "Enregistrer la vente"}
          </Bouton>
        </Carte>
      </div>
      <Notification retour={retour} />
    </div>
  );
}
