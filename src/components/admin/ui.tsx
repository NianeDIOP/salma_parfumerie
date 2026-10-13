"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Photo } from "@/components/photo";
import { envoyerImage } from "@/lib/actions/admin";
import type { Produit } from "@/lib/catalogue";
import type { Lien } from "@/lib/site";

// ---------- Mise en page ----------

export function EnTetePage({ titre, description, actions }: { titre: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{titre}</h1>
        {description && <p className="mt-1 max-w-2xl text-base text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Carte({ titre, description, children, actions, className = "" }: { titre?: string; description?: string; children: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 md:p-6 ${className}`}>
      {(titre || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {titre && <h2 className="text-lg font-bold">{titre}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Champ({ label, aide, children, className = "" }: { label: string; aide?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {aide && <span className="mt-1 block text-xs text-muted">{aide}</span>}
    </label>
  );
}

const styleSaisie = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10";

export function Saisie(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${styleSaisie} ${props.className ?? ""}`} />;
}

export function SaisieNombre({ value, onChange, ...props }: { value: number; onChange: (n: number) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <input type="number" inputMode="numeric" {...props} value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(Number(e.target.value))} className={`${styleSaisie} tabular-nums ${props.className ?? ""}`} />;
}

export function Zone(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${styleSaisie} ${props.className ?? ""}`} />;
}

export function Liste({ options, ...props }: { options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${styleSaisie} ${props.className ?? ""}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Interrupteur({ checked, onChange, label, aide }: { checked: boolean; onChange: (v: boolean) => void; label: string; aide?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 py-2 text-left" role="switch" aria-checked={checked}>
      <span>
        <span className="block text-base font-medium">{label}</span>
        {aide && <span className="block text-sm text-muted">{aide}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-bissap" : "bg-line"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

export function Couleur({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-line p-2 pr-3">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-10 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{label}</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm text-muted outline-none" />
      </span>
    </label>
  );
}

type Variante = "principal" | "secondaire" | "danger" | "discret";
export function Bouton({ variante = "principal", className = "", ...props }: { variante?: Variante } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<Variante, string> = {
    principal: "bg-ink text-white hover:bg-bissap",
    secondaire: "border border-line bg-white hover:border-ink",
    danger: "bg-white text-bissap border border-bissap/30 hover:bg-bissap hover:text-white",
    discret: "text-muted hover:text-ink hover:bg-line/60",
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${styles[variante]} ${className}`}
    />
  );
}

export function Badge({ couleur, children }: { couleur: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: couleur + "1f", color: couleur }}>
      <span className="size-1.5 rounded-full" style={{ background: couleur }} />
      {children}
    </span>
  );
}

// ---------- Enregistrement ----------

type Res = { ok: boolean; message?: string };

// Lance une action serveur, affiche le résultat et rafraîchit les données de la page.
export function useAction() {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [retour, setRetour] = useState<{ ok: boolean; message: string } | null>(null);
  const lancer = (action: () => Promise<Res>, apres?: (r: Res) => void) =>
    demarrer(async () => {
      const r = await action();
      setRetour({ ok: r.ok, message: r.message ?? (r.ok ? "Enregistré." : "Erreur.") });
      if (r.ok) router.refresh();
      apres?.(r);
      setTimeout(() => setRetour(null), 3500);
    });
  return { enCours, retour, lancer };
}

export function Notification({ retour }: { retour: { ok: boolean; message: string } | null }) {
  if (!retour) return null;
  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 animate-fade-up rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl md:bottom-8 ${retour.ok ? "bg-ink" : "bg-bissap"}`}
      role="status"
    >
      {retour.ok ? "✓ " : "⚠ "}
      {retour.message}
    </div>
  );
}

export function BarreEnregistrer({ modifie, enCours, onEnregistrer, onAnnuler, libelle = "Enregistrer et publier" }: { modifie: boolean; enCours: boolean; onEnregistrer: () => void; onAnnuler?: () => void; libelle?: string }) {
  return (
    <div
      className={`sticky bottom-0 z-30 -mx-4 mt-8 flex items-center justify-end gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur transition md:-mx-8 md:px-8 ${
        modifie ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span className="mr-auto text-sm text-muted">Modifications non enregistrées</span>
      {onAnnuler && (
        <Bouton variante="discret" onClick={onAnnuler}>
          Annuler
        </Bouton>
      )}
      <Bouton onClick={onEnregistrer} disabled={enCours}>
        {enCours ? "Enregistrement…" : libelle}
      </Bouton>
    </div>
  );
}

// Gère un brouillon local d'une valeur et indique s'il diffère de la version enregistrée
export function useBrouillon<T>(initial: T) {
  const [valeur, setValeur] = useState<T>(initial);
  const [reference, setReference] = useState(() => JSON.stringify(initial));
  const modifie = JSON.stringify(valeur) !== reference;
  return {
    valeur,
    setValeur,
    modifie,
    valider: () => setReference(JSON.stringify(valeur)),
    annuler: () => setValeur(JSON.parse(reference) as T),
  };
}

// ---------- Champs spécialisés ----------

export function ChampImage({ label = "Image", value, onChange, aide }: { label?: string; value: string; onChange: (v: string) => void; aide?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <div className="flex gap-3">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-line bg-creme">
          {value ? <Photo id={value} alt="" sizes="96px" /> : <span className="grid h-full place-items-center text-xs text-muted">Aucune</span>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Saisie value={value} onChange={(e) => onChange(e.target.value)} placeholder="Identifiant Unsplash, lien https://… ou image envoyée" />
          <div className="flex flex-wrap gap-2">
            <Bouton variante="secondaire" onClick={() => input.current?.click()} disabled={envoi}>
              {envoi ? "Envoi…" : "Envoyer une image"}
            </Bouton>
            {value && (
              <Bouton variante="discret" onClick={() => onChange("")}>
                Retirer
              </Bouton>
            )}
          </div>
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setEnvoi(true);
              setErreur("");
              const form = new FormData();
              form.append("fichier", f);
              const r = await envoyerImage(form);
              setEnvoi(false);
              e.target.value = "";
              if (r.ok && "url" in r && r.url) onChange(r.url);
              else setErreur(r.message ?? "Envoi impossible.");
            }}
          />
          {erreur && <p className="text-xs text-bissap">{erreur}</p>}
          {aide && <p className="text-xs text-muted">{aide}</p>}
        </div>
      </div>
    </div>
  );
}

export function ChampLien({ value, onChange, labelTexte = "Texte", labelLien = "Lien" }: { value: Lien; onChange: (v: Lien) => void; labelTexte?: string; labelLien?: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Champ label={labelTexte}>
        <Saisie value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} />
      </Champ>
      <Champ label={labelLien}>
        <Saisie value={value.href} onChange={(e) => onChange({ ...value, href: e.target.value })} placeholder="/parfums" />
      </Champ>
    </div>
  );
}

// Liste d'éléments réordonnables (monter, descendre, supprimer, ajouter)
export function ListeOrdonnee<T>({
  items,
  onChange,
  rendu,
  nouveau,
  libelleAjout = "Ajouter",
  vide = "Aucun élément.",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  rendu: (item: T, maj: (v: T) => void, index: number) => React.ReactNode;
  nouveau?: () => T;
  libelleAjout?: string;
  vide?: string;
}) {
  const deplacer = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const copie = [...items];
    [copie[i], copie[j]] = [copie[j], copie[i]];
    onChange(copie);
  };
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted">{vide}</p>}
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 rounded-xl border border-line bg-creme-light/60 p-3">
          <div className="min-w-0 flex-1">{rendu(it, (v) => onChange(items.map((x, k) => (k === i ? v : x))), i)}</div>
          <div className="flex shrink-0 flex-col gap-1">
            <button type="button" onClick={() => deplacer(i, -1)} disabled={i === 0} className="grid size-8 place-items-center rounded-lg hover:bg-line disabled:opacity-30" aria-label="Monter">
              ↑
            </button>
            <button type="button" onClick={() => deplacer(i, 1)} disabled={i === items.length - 1} className="grid size-8 place-items-center rounded-lg hover:bg-line disabled:opacity-30" aria-label="Descendre">
              ↓
            </button>
            <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="grid size-8 place-items-center rounded-lg text-bissap hover:bg-bissap/10" aria-label="Supprimer">
              ✕
            </button>
          </div>
        </div>
      ))}
      {nouveau && (
        <Bouton variante="secondaire" onClick={() => onChange([...items, nouveau()])}>
          + {libelleAjout}
        </Bouton>
      )}
    </div>
  );
}

// Sélection d'un ou plusieurs produits, avec recherche
export function ChoixProduits({ produits, valeur, onChange, multiple = true }: { produits: Produit[]; valeur: string[]; onChange: (v: string[]) => void; multiple?: boolean }) {
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const choisis = valeur.map((s) => produits.find((p) => p.slug === s)).filter((p): p is Produit => Boolean(p));
  const filtres = produits.filter((p) => !valeur.includes(p.slug) && `${p.marque} ${p.nom}`.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {choisis.map((p, i) => (
          <span key={p.slug} className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-2 text-sm">
            <span className="relative size-7 overflow-hidden rounded-full" style={{ background: p.theme.bg }}>
              <Photo id={p.images[0]} alt="" sizes="28px" />
            </span>
            {multiple && <span className="text-xs text-muted">{i + 1}.</span>}
            {p.nom}
            {multiple && i > 0 && (
              <button type="button" onClick={() => onChange(valeur.map((s, k) => (k === i - 1 ? valeur[i] : k === i ? valeur[i - 1] : s)))} className="text-muted" aria-label="Avancer">
                ←
              </button>
            )}
            <button type="button" onClick={() => onChange(valeur.filter((s) => s !== p.slug))} className="text-bissap" aria-label={`Retirer ${p.nom}`}>
              ✕
            </button>
          </span>
        ))}
      </div>
      {(multiple || choisis.length === 0) && (
        <div className="relative mt-2">
          <Saisie value={q} onFocus={() => setOuvert(true)} onBlur={() => setTimeout(() => setOuvert(false), 150)} onChange={(e) => setQ(e.target.value)} placeholder={multiple ? "Ajouter un produit…" : "Choisir un produit…"} />
          {ouvert && filtres.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-xl border border-line bg-white shadow-xl">
              {filtres.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onMouseDown={() => {
                      onChange(multiple ? [...valeur, p.slug] : [p.slug]);
                      setQ("");
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-creme"
                  >
                    <span className="relative size-8 overflow-hidden rounded-lg" style={{ background: p.theme.bg }}>
                      <Photo id={p.images[0]} alt="" sizes="32px" />
                    </span>
                    <span className="text-muted">{p.marque}</span> {p.nom}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
