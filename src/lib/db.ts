// Base de données du site : un fichier JSON dans /data (hors Git).
// Lecture mise en cache tant que le fichier ne change pas, écriture atomique et en file
// (pas de corruption si deux enregistrements arrivent en même temps).
// Pour la production à fort trafic, ce module pourra être remplacé par PostgreSQL
// sans toucher au reste du code : il suffit de garder les mêmes fonctions.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Produit, Univers } from "./catalogue";
import { hacherMotDePasse } from "./password";
import { produitsParDefaut, reglagesParDefaut, universParDefaut } from "./seed";
import type { Admin, CodePromo, Commande, Reglages } from "./site";

export interface Base {
  version: number;
  reglages: Reglages;
  produits: Produit[];
  univers: Univers[];
  commandes: Commande[];
  codes: CodePromo[];
  admins: Admin[];
}

export const DOSSIER_DONNEES = process.env.SALMA_DATA_DIR ?? path.join(process.cwd(), "data");
const FICHIER = path.join(DOSSIER_DONNEES, "salma-db.json");

export const ADMIN_PAR_DEFAUT = { email: "admin@salma.sn", motDePasse: "salma2026" };

let cache: { mtime: number; base: Base } | null = null;
let fileEcriture: Promise<unknown> = Promise.resolve();
let creation: Promise<Base> | null = null;

function baseInitiale(): Base {
  return {
    version: 1,
    reglages: structuredClone(reglagesParDefaut),
    produits: structuredClone(produitsParDefaut),
    univers: structuredClone(universParDefaut),
    commandes: [],
    codes: [
      { code: "CERCLE10", type: "pourcentage", valeur: 10, actif: true, minimum: 0, utilisations: 0 },
      { code: "BIENVENUE", type: "montant", valeur: 5000, actif: true, minimum: 40000, utilisations: 0 },
    ],
    admins: [{ email: ADMIN_PAR_DEFAUT.email, nom: "Administrateur", hash: hacherMotDePasse(ADMIN_PAR_DEFAUT.motDePasse) }],
  };
}

// Complète une base ancienne avec les réglages ajoutés depuis (mises à jour du site)
function completer(base: Base): Base {
  const r = base.reglages as Partial<Reglages>;
  const d = reglagesParDefaut;
  base.reglages = {
    ...d,
    ...r,
    identite: { ...d.identite, ...r.identite, couleurs: { ...d.identite.couleurs, ...r.identite?.couleurs } },
    contact: { ...d.contact, ...r.contact },
    entete: { ...d.entete, ...r.entete },
    mobile: { onglets: { ...d.mobile.onglets, ...r.mobile?.onglets } },
    pied: { ...d.pied, ...r.pied, newsletter: { ...d.pied.newsletter, ...r.pied?.newsletter } },
    livraison: { ...d.livraison, ...r.livraison },
    paiements: { ...d.paiements, ...r.paiements },
    seo: { ...d.seo, ...r.seo },
    boutique: { ...d.boutique, ...r.boutique },
    admin: { ...d.admin, ...r.admin },
  } as Reglages;
  base.codes ??= [];
  base.commandes ??= [];
  return base;
}

export async function lireBase(): Promise<Base> {
  try {
    const stat = await fs.stat(FICHIER);
    if (cache && cache.mtime === stat.mtimeMs) return cache.base;
    const base = completer(JSON.parse(await fs.readFile(FICHIER, "utf8")) as Base);
    cache = { mtime: stat.mtimeMs, base };
    return base;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    // Premier lancement : une seule création, même si plusieurs lectures arrivent en même temps
    creation ??= (async () => {
      const base = baseInitiale();
      await ecrire(base);
      console.log(`\n[salma] Base créée dans ${FICHIER}`);
      console.log(`[salma] Administration : /admin  ·  ${ADMIN_PAR_DEFAUT.email} / ${ADMIN_PAR_DEFAUT.motDePasse} (à changer)\n`);
      return base;
    })();
    return creation;
  }
}

async function ecrire(base: Base) {
  await fs.mkdir(DOSSIER_DONNEES, { recursive: true });
  const tmp = `${FICHIER}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(base, null, 2), "utf8");
  await fs.rename(tmp, FICHIER);
  const stat = await fs.stat(FICHIER);
  cache = { mtime: stat.mtimeMs, base };
}

// Modifie la base de façon sûre : la fonction reçoit une copie, la modifie, puis elle est enregistrée.
export function modifierBase<T>(modif: (base: Base) => T | Promise<T>): Promise<T> {
  const tache = fileEcriture.then(async () => {
    const base = structuredClone(await lireBase());
    const resultat = await modif(base);
    await ecrire(base);
    return resultat;
  });
  fileEcriture = tache.catch(() => {});
  return tache;
}
