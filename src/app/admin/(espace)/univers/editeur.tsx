"use client";

import { BarreEnregistrer, Champ, ChampImage, Couleur, Interrupteur, ListeOrdonnee, Notification, Saisie, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { enregistrerUnivers } from "@/lib/actions/admin";
import type { Univers } from "@/lib/catalogue";

export function EditeurUnivers({ univers, compte }: { univers: Univers[]; compte: Record<string, number> }) {
  const b = useBrouillon(univers);
  const { enCours, retour, lancer } = useAction();
  return (
    <>
      <ListeOrdonnee
        items={b.valeur}
        onChange={b.setValeur}
        libelleAjout="Ajouter un univers"
        nouveau={() => ({ slug: "", nom: "", accroche: "", description: "", image: "", theme: { bg: "#1f2a5c", accent: "#f2d0d7", dark: true } })}
        rendu={(u, maj) => (
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Champ label="Nom">
                  <Saisie value={u.nom} onChange={(e) => maj({ ...u, nom: e.target.value })} />
                </Champ>
                <Champ label="Adresse" aide={`/${u.slug || "…"} · ${compte[u.slug] ?? 0} produit(s)`}>
                  <Saisie value={u.slug} onChange={(e) => maj({ ...u, slug: e.target.value })} placeholder="parfums" />
                </Champ>
              </div>
              <Champ label="Accroche">
                <Saisie value={u.accroche} onChange={(e) => maj({ ...u, accroche: e.target.value })} />
              </Champ>
              <Champ label="Description">
                <Zone value={u.description} onChange={(e) => maj({ ...u, description: e.target.value })} rows={2} />
              </Champ>
            </div>
            <div className="space-y-3">
              <ChampImage value={u.image} onChange={(image) => maj({ ...u, image })} />
              <div className="grid grid-cols-2 gap-2">
                <Couleur label="Couleur" value={u.theme.bg} onChange={(bg) => maj({ ...u, theme: { ...u.theme, bg } })} />
                <Couleur label="Accent" value={u.theme.accent} onChange={(accent) => maj({ ...u, theme: { ...u.theme, accent } })} />
              </div>
              <Interrupteur checked={u.theme.dark} onChange={(dark) => maj({ ...u, theme: { ...u.theme, dark } })} label="Couleur sombre (texte blanc)" />
            </div>
          </div>
        )}
      />
      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerUnivers(b.valeur), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </>
  );
}
