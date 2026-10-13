"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarreEnregistrer,
  Bouton,
  Carte,
  Champ,
  ChampImage,
  Couleur,
  EnTetePage,
  Interrupteur,
  Liste,
  ListeOrdonnee,
  Notification,
  Saisie,
  SaisieNombre,
  useAction,
  useBrouillon,
  Zone,
} from "@/components/admin/ui";
import { Photo } from "@/components/photo";
import { enregistrerProduit, supprimerProduit } from "@/lib/actions/admin";
import { familles, genres, occasions, type Occasion, type Produit, type Univers } from "@/lib/catalogue";

const badges = ["", "Best-seller", "Nouveau", "Édition limitée", "Coup de cœur", "Maison SALMA"] as const;

function produitVide(univers: string): Produit {
  return {
    slug: "",
    nom: "",
    marque: "",
    univers,
    type: "Eau de parfum",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 3,
    occasions: [],
    accroche: "",
    description: "",
    pyramide: { tete: [], coeur: [], fond: [] },
    tenue: { valeur: 70, label: "7 h" },
    sillage: { valeur: 60, label: "Présent" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: [],
    note: 5,
    avis: 0,
    contenances: [{ label: "50 ml", prix: 0, stock: 0 }],
    images: [],
    theme: { bg: "#f2d0d7", accent: "#a8153a", dark: false },
    publie: false,
    seuilAlerte: 5,
  };
}

const liste = (t: string) =>
  t
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function EditeurProduit({ produit, univers, marques }: { produit: Produit | null; univers: Univers[]; marques: string[] }) {
  const router = useRouter();
  const b = useBrouillon<Produit>(produit ?? produitVide(univers[0]?.slug ?? "parfums"));
  const p = b.valeur;
  const set = (v: Partial<Produit>) => b.setValeur({ ...p, ...v });
  const { enCours, retour, lancer } = useAction();
  const encre = p.theme.dark ? "#fff" : "#1a1a1a";

  const enregistrer = () =>
    lancer(
      () => enregistrerProduit(p, produit?.slug ?? null),
      (r) => {
        if (!r.ok) return;
        b.valider();
        const slug = "slug" in r ? (r.slug as string) : p.slug;
        if (slug !== produit?.slug) router.replace(`/admin/produits/${slug}`);
      },
    );

  return (
    <>
      <Link href="/admin/produits" className="text-sm font-semibold text-muted hover:text-ink">
        ← Produits
      </Link>
      <div className="mt-3">
        <EnTetePage
          titre={produit ? `${p.marque} ${p.nom}`.trim() || "Produit" : "Nouveau produit"}
          actions={
            <>
              {produit && (
                <a href={`/${produit.univers}/${produit.slug}`} target="_blank" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-ink">
                  Voir sur le site ↗
                </a>
              )}
              <Bouton onClick={enregistrer} disabled={enCours}>
                {enCours ? "Enregistrement…" : "Enregistrer"}
              </Bouton>
            </>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Carte titre="Informations">
            <div className="grid gap-3 sm:grid-cols-2">
              <Champ label="Nom du produit">
                <Saisie value={p.nom} onChange={(e) => set({ nom: e.target.value })} placeholder="Coco Noir" />
              </Champ>
              <Champ label="Marque">
                <Saisie value={p.marque} onChange={(e) => set({ marque: e.target.value })} list="marques" placeholder="Chanel" />
                <datalist id="marques">
                  {marques.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Champ>
              <Champ label="Univers">
                <Liste value={p.univers} onChange={(e) => set({ univers: e.target.value })} options={univers.map((u) => ({ value: u.slug, label: u.nom }))} />
              </Champ>
              <Champ label="Type">
                <Saisie value={p.type} onChange={(e) => set({ type: e.target.value })} placeholder="Eau de parfum" />
              </Champ>
              <Champ label="Badge">
                <Liste value={p.badge ?? ""} onChange={(e) => set({ badge: (e.target.value || undefined) as Produit["badge"] })} options={badges.map((x) => ({ value: x, label: x || "Aucun" }))} />
              </Champ>
              <Champ label="Adresse (slug)" aide="Laisser vide pour la créer à partir du nom">
                <Saisie value={p.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="coco-noir" />
              </Champ>
            </div>
            <div className="mt-3 grid gap-3">
              <Champ label="Accroche" aide="Phrase courte affichée dans le hero et les sections">
                <Saisie value={p.accroche} onChange={(e) => set({ accroche: e.target.value })} />
              </Champ>
              <Champ label="Description">
                <Zone value={p.description} onChange={(e) => set({ description: e.target.value })} rows={5} />
              </Champ>
            </div>
          </Carte>

          <Carte titre="Photos" description="La première photo est la principale. Identifiant Unsplash, lien web ou image envoyée depuis votre ordinateur.">
            <ListeOrdonnee
              items={p.images}
              onChange={(images) => set({ images })}
              nouveau={() => ""}
              libelleAjout="Ajouter une photo"
              vide="Aucune photo."
              rendu={(img, maj, i) => <ChampImage label={i === 0 ? "Photo principale" : `Photo ${i + 1}`} value={img} onChange={maj} />}
            />
          </Carte>

          <Carte titre="Prix et stock" description="Une ligne par contenance (30 ml, 50 ml, 100 ml…).">
            <ListeOrdonnee
              items={p.contenances}
              onChange={(contenances) => set({ contenances })}
              nouveau={() => ({ label: "", prix: 0, stock: 0 })}
              libelleAjout="Ajouter une contenance"
              rendu={(c, maj) => (
                <div className="grid grid-cols-3 gap-2">
                  <Champ label="Contenance">
                    <Saisie value={c.label} onChange={(e) => maj({ ...c, label: e.target.value })} placeholder="50 ml" />
                  </Champ>
                  <Champ label="Prix (FCFA)">
                    <SaisieNombre value={c.prix} min={0} step={500} onChange={(n) => maj({ ...c, prix: n })} />
                  </Champ>
                  <Champ label="Stock">
                    <SaisieNombre value={c.stock} min={0} onChange={(n) => maj({ ...c, stock: n })} />
                  </Champ>
                </div>
              )}
            />
            <Champ label="Alerte de stock à partir de" className="mt-4 max-w-xs">
              <SaisieNombre value={p.seuilAlerte ?? 5} min={0} onChange={(n) => set({ seuilAlerte: n })} />
            </Champ>
          </Carte>

          <Carte titre="Profil olfactif">
            <div className="grid gap-3 sm:grid-cols-3">
              <Champ label="Famille">
                <Liste value={p.famille} onChange={(e) => set({ famille: e.target.value as Produit["famille"] })} options={familles.map((f) => ({ value: f, label: f }))} />
              </Champ>
              <Champ label="Pour">
                <Liste value={p.genre} onChange={(e) => set({ genre: e.target.value as Produit["genre"] })} options={genres.map((g) => ({ value: g, label: g }))} />
              </Champ>
              <Champ label="Intensité (1 à 4)">
                <SaisieNombre value={p.intensite} min={1} max={4} onChange={(n) => set({ intensite: Math.min(4, Math.max(1, n)) as Produit["intensite"] })} />
              </Champ>
            </div>
            <div className="mt-4">
              <span className="mb-1.5 block text-sm font-semibold">Occasions</span>
              <div className="flex flex-wrap gap-2">
                {occasions.map((o) => {
                  const actif = p.occasions.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => set({ occasions: actif ? p.occasions.filter((x) => x !== o) : [...p.occasions, o as Occasion] })}
                      className={`rounded-full border px-4 py-2 text-sm font-medium ${actif ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {(["tete", "coeur", "fond"] as const).map((k) => (
                <Champ key={k} label={`Notes de ${k === "tete" ? "tête" : k === "coeur" ? "cœur" : "fond"}`} aide="Séparées par des virgules">
                  <Saisie defaultValue={p.pyramide[k].join(", ")} onBlur={(e) => set({ pyramide: { ...p.pyramide, [k]: liste(e.target.value) } })} />
                </Champ>
              ))}
              <Champ label="Mots-clés" aide="Séparés par des virgules (aussi utilisés par la recherche)">
                <Saisie defaultValue={p.tags.join(", ")} onBlur={(e) => set({ tags: liste(e.target.value) })} />
              </Champ>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(["tenue", "sillage", "saison"] as const).map((k) => (
                <div key={k} className="rounded-xl border border-line p-3">
                  <p className="text-sm font-semibold capitalize">{k}</p>
                  <input type="range" min={0} max={100} value={p[k].valeur} onChange={(e) => set({ [k]: { ...p[k], valeur: Number(e.target.value) } })} className="mt-2 w-full accent-bissap" />
                  <Saisie value={p[k].label} onChange={(e) => set({ [k]: { ...p[k], label: e.target.value } })} />
                </div>
              ))}
            </div>
          </Carte>
        </div>

        <div className="space-y-4">
          <Carte titre="Publication">
            <Interrupteur checked={p.publie !== false} onChange={(v) => set({ publie: v })} label="Visible sur le site" aide={p.publie === false ? "Brouillon : seul l'admin le voit" : "En ligne"} />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Champ label="Note moyenne">
                <SaisieNombre value={p.note} step={0.1} min={0} max={5} onChange={(n) => set({ note: n })} />
              </Champ>
              <Champ label="Nombre d'avis">
                <SaisieNombre value={p.avis} min={0} onChange={(n) => set({ avis: n })} />
              </Champ>
            </div>
          </Carte>

          <Carte titre="Couleurs du produit" description="Elles colorent le fond du hero, de la fiche produit et des cartes.">
            <div className="grid gap-2">
              <Couleur label="Fond" value={p.theme.bg} onChange={(bg) => set({ theme: { ...p.theme, bg } })} />
              <Couleur label="Accent" value={p.theme.accent} onChange={(accent) => set({ theme: { ...p.theme, accent } })} />
              <Interrupteur checked={p.theme.dark} onChange={(dark) => set({ theme: { ...p.theme, dark } })} label="Fond sombre" aide="Texte en blanc" />
            </div>
            {/* Aperçu */}
            <div className="mt-4 overflow-hidden rounded-2xl" style={{ background: p.theme.bg, color: encre }}>
              <div className="relative mx-auto mt-5 aspect-[4/5] w-2/3 overflow-hidden rounded-t-full" style={{ background: p.theme.accent }}>
                {p.images[0] && <Photo id={p.images[0]} alt="" sizes="200px" />}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold" style={{ color: p.theme.accent }}>
                  {p.marque || "Marque"}
                </p>
                <p className="text-2xl font-extrabold tracking-tight">{p.nom || "Nom du produit"}</p>
                <p className="text-sm opacity-80">{p.accroche}</p>
              </div>
            </div>
          </Carte>

          {produit && (
            <Carte titre="Zone sensible">
              <Bouton
                variante="danger"
                onClick={() => {
                  if (confirm("Supprimer définitivement ce produit ?")) lancer(() => supprimerProduit(produit.slug), (r) => r.ok && router.push("/admin/produits"));
                }}
              >
                Supprimer le produit
              </Bouton>
            </Carte>
          )}
        </div>
      </div>

      <BarreEnregistrer modifie={b.modifie} enCours={enCours} onEnregistrer={enregistrer} onAnnuler={b.annuler} libelle="Enregistrer le produit" />
      <Notification retour={retour} />
    </>
  );
}
