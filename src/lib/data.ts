// Lecture des données pour le site public (côté serveur).
import { lireBase } from "./db";
import type { DonneesSite } from "./site";

export async function donneesSite(): Promise<DonneesSite> {
  const base = await lireBase();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- le thème admin reste privé
  const { pages, admin, ...reste } = base.reglages;
  return {
    reglages: { ...reste, pages: pages.map(({ slug, titre, publie }) => ({ slug, titre, publie })) },
    produits: base.produits.filter((p) => p.publie !== false),
    univers: base.univers,
  };
}

export async function pageLibre(slug: string) {
  const base = await lireBase();
  return base.reglages.pages.find((p) => p.slug === slug && p.publie);
}
