"use client";

import { useState } from "react";
import { BarreEnregistrer, Bouton, Carte, Champ, Interrupteur, Notification, Saisie, useAction, useBrouillon, Zone } from "@/components/admin/ui";
import { enregistrerReglages } from "@/lib/actions/admin";
import type { PageLibre } from "@/lib/site";
import { slugifier } from "@/lib/slug";

export function EditeurPages({ pages }: { pages: PageLibre[] }) {
  const b = useBrouillon(pages);
  const [choix, setChoix] = useState(0);
  const { enCours, retour, lancer } = useAction();
  const p = b.valeur[choix];
  const maj = (v: Partial<PageLibre>) => b.setValeur(b.valeur.map((x, i) => (i === choix ? { ...x, ...v } : x)));

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        {b.valeur.map((x, i) => (
          <button key={i} onClick={() => setChoix(i)} className={`block w-full rounded-xl border px-4 py-3 text-left ${i === choix ? "border-ink bg-white" : "border-line bg-white/60"}`}>
            <span className="block font-semibold">{x.titre || "Sans titre"}</span>
            <span className="text-sm text-muted">
              /pages/{x.slug} · {x.publie ? "publiée" : "brouillon"}
            </span>
          </button>
        ))}
        <Bouton
          variante="secondaire"
          className="w-full"
          onClick={() => {
            b.setValeur([...b.valeur, { slug: `page-${b.valeur.length + 1}`, titre: "Nouvelle page", contenu: "", publie: false }]);
            setChoix(b.valeur.length);
          }}
        >
          + Nouvelle page
        </Bouton>
      </div>

      {p ? (
        <Carte
          titre={p.titre}
          actions={
            <a href={`/pages/${p.slug}`} target="_blank" className="text-sm font-semibold text-bissap">
              Voir ↗
            </a>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Titre">
              <Saisie value={p.titre} onChange={(e) => maj({ titre: e.target.value })} />
            </Champ>
            <Champ label="Adresse" aide={`/pages/${p.slug}`}>
              <Saisie value={p.slug} onChange={(e) => maj({ slug: slugifier(e.target.value) })} />
            </Champ>
          </div>
          <Champ label="Contenu" aide="Ligne vide entre deux paragraphes. Commencez une ligne par « ## » pour un sous-titre." className="mt-3">
            <Zone value={p.contenu} onChange={(e) => maj({ contenu: e.target.value })} rows={16} className="font-mono text-sm" />
          </Champ>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="w-64">
              <Interrupteur checked={p.publie} onChange={(publie) => maj({ publie })} label="Publiée" />
            </div>
            <Bouton
              variante="danger"
              onClick={() => {
                if (!confirm("Supprimer cette page ?")) return;
                b.setValeur(b.valeur.filter((_, i) => i !== choix));
                setChoix(0);
              }}
            >
              Supprimer
            </Bouton>
          </div>
        </Carte>
      ) : (
        <p className="text-muted">Aucune page.</p>
      )}
      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onAnnuler={b.annuler} onEnregistrer={() => lancer(() => enregistrerReglages({ pages: b.valeur }), (r) => r.ok && b.valider())} />
      <Notification retour={retour} />
    </div>
  );
}
