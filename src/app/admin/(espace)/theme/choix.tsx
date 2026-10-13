"use client";

import { useEffect, useRef } from "react";
import { Icone } from "@/components/admin/icones";
import { BarreEnregistrer, Bouton, Carte, Champ, Couleur, Interrupteur, Liste, Notification, useAction, useBrouillon } from "@/components/admin/ui";
import { enregistrerReglages } from "@/lib/actions/admin";
import { arrondis, themeEffectif, themesAdmin, variablesTheme, type ThemeAdmin } from "@/lib/admin-themes";
import { polices } from "@/lib/site";

type Perso = Partial<ThemeAdmin>;

const rayon = { carre: 3, doux: 7, arrondi: 12 };

// Miniature d'un thème : barre latérale, en-tête, cartes et bouton
function Miniature({ t }: { t: ThemeAdmin }) {
  const r = rayon[t.arrondi];
  return (
    <div className="flex h-28 overflow-hidden" style={{ background: t.fond, borderRadius: r }}>
      <div className="flex w-[30%] flex-col gap-1.5 p-2" style={{ background: t.barre }}>
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: t.barreActif }} />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-2 rounded-sm" style={{ background: i === 1 ? t.barreActif : t.barreTexte, opacity: i === 1 ? 1 : 0.35, width: `${85 - i * 12}%` }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <div className="flex items-center justify-between">
          <span className="h-2 w-12 rounded-sm" style={{ background: t.texte, opacity: 0.8 }} />
          <span className="h-3.5 w-9" style={{ background: t.bouton, borderRadius: r / 2 }} />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col justify-between border p-1.5" style={{ background: t.surface, borderColor: t.ligne, borderRadius: r / 1.5 }}>
              <span className="h-1.5 w-8 rounded-sm" style={{ background: t.texteDoux, opacity: 0.6 }} />
              <span className="h-2.5 w-10 rounded-sm" style={{ background: i ? t.primaire : t.texte }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChoixTheme({ theme, perso }: { theme: string; perso: Perso }) {
  const b = useBrouillon<{ theme: string; perso: Perso }>({ theme, perso });
  const { enCours, retour, lancer } = useAction();
  const t = themeEffectif(b.valeur.theme, b.valeur.perso);
  const set = (champs: Perso) => b.setValeur({ ...b.valeur, perso: { ...b.valeur.perso, ...champs } });

  // Aperçu en direct : le thème en cours d'édition est appliqué immédiatement à tout l'admin.
  // En quittant la page sans enregistrer, le thème enregistré est rétabli.
  useEffect(() => {
    const el = document.getElementById("theme-admin");
    if (!el) return;
    Object.entries(variablesTheme(t)).forEach(([k, v]) => el.style.setProperty(k, v));
  }, [t]);
  const enregistre = useRef({ theme, perso });
  useEffect(() => {
    enregistre.current = { theme, perso };
  }, [theme, perso]);
  useEffect(() => {
    return () => {
      const el = document.getElementById("theme-admin");
      if (!el) return;
      const { theme: id, perso: p } = enregistre.current;
      Object.entries(variablesTheme(themeEffectif(id, p))).forEach(([k, v]) => el.style.setProperty(k, v));
    };
  }, []);

  const champsCouleur: [keyof ThemeAdmin, string][] = [
    ["primaire", "Couleur d'accent"],
    ["bouton", "Bouton principal"],
    ["boutonTexte", "Texte du bouton"],
    ["fond", "Fond général"],
    ["surface", "Cartes et champs"],
    ["surfaceAlt", "Zones secondaires"],
    ["texte", "Texte"],
    ["texteDoux", "Texte secondaire"],
    ["ligne", "Bordures"],
    ["barre", "Barre latérale"],
    ["barreTexte", "Texte de la barre"],
    ["barreActif", "Élément actif"],
    ["barreActifTexte", "Texte de l'élément actif"],
  ];

  return (
    <>
      <Carte titre="Modèles" icone="calques" description="Cliquez sur un modèle pour l'essayer : l'admin change aussitôt">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {themesAdmin.map((m) => {
            const actif = b.valeur.theme === m.id;
            const enregistre = theme === m.id;
            return (
              <button
                key={m.id}
                onClick={() => b.setValeur({ theme: m.id, perso: {} })}
                className={`group rounded-xl border p-2 text-left transition ${actif ? "border-ink ring-2 ring-ink/15" : "border-line hover:border-ink/40"}`}
              >
                <Miniature t={m} />
                <div className="mt-2 flex items-start justify-between gap-2 px-0.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                      {m.nom}
                      {m.sombre && <span className="rounded bg-ink/10 px-1 text-[10px] font-medium">sombre</span>}
                    </p>
                    <p className="text-[11px] leading-snug text-muted">{m.description}</p>
                  </div>
                  {actif && (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--a-bouton)] text-[var(--a-bouton-texte)]">
                      <Icone nom="check" className="size-3" />
                    </span>
                  )}
                </div>
                {enregistre && <p className="mt-1 px-0.5 text-[10px] font-semibold text-[#2f8f5b]">Thème actuel</p>}
              </button>
            );
          })}
        </div>
      </Carte>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Carte titre="Style" icone="texte">
          <div className="space-y-3">
            <Champ label="Police">
              <Liste
                value={t.police}
                onChange={(e) => set({ police: e.target.value as ThemeAdmin["police"] })}
                options={[{ value: "systeme", label: "Police du système (sobre)" }, ...polices.map((p) => ({ value: p.id, label: p.nom }))]}
              />
            </Champ>
            <div>
              <span className="mb-1 block text-xs font-medium text-ink/70">Arrondis</span>
              <div className="grid grid-cols-3 gap-1.5">
                {arrondis.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => set({ arrondi: a.id })}
                    className={`flex h-9 items-center justify-center gap-2 border text-xs font-medium ${t.arrondi === a.id ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
                    style={{ borderRadius: rayon[a.id] }}
                  >
                    <span className="size-3.5 border-2 border-current" style={{ borderRadius: rayon[a.id] / 2 }} />
                    {a.nom}
                  </button>
                ))}
              </div>
            </div>
            <Interrupteur checked={t.sombre} onChange={(sombre) => set({ sombre })} label="Mode sombre des champs natifs" aide="Listes déroulantes et calendriers en sombre" />
          </div>
        </Carte>

        <Carte
          titre="Couleurs"
          icone="couleur"
          description="Ajustez le modèle choisi"
          actions={
            Object.keys(b.valeur.perso).length > 0 && (
              <Bouton variante="discret" icone="retour" className="h-7 px-2 text-xs" onClick={() => b.setValeur({ ...b.valeur, perso: {} })}>
                Couleurs du modèle
              </Bouton>
            )
          }
        >
          <div className="grid gap-1.5 sm:grid-cols-2">
            {champsCouleur.map(([k, label]) => (
              <Couleur key={k} label={label} value={String(t[k])} onChange={(v) => set({ [k]: v })} />
            ))}
          </div>
        </Carte>
      </div>

      <BarreEnregistrer
        modifie={b.modifie}
        enCours={enCours}
        libelle="Appliquer ce thème"
        onAnnuler={b.annuler}
        onEnregistrer={() => lancer(() => enregistrerReglages({ admin: b.valeur }), (r) => r.ok && b.valider())}
      />
      <Notification retour={retour} />
    </>
  );
}
