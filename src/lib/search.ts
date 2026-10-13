import type { Produit } from "./catalogue";

export function normaliser(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
}

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

// Un mot de la requête correspond s'il est le début d'un mot indexé
// ou s'il en est proche à une ou deux fautes près (« jasmain » → « jasmin »).
function motCorrespond(mot: string, index: string[]) {
  const tolerance = mot.length <= 4 ? 0 : mot.length <= 7 ? 1 : 2;
  return index.some((w) => w.startsWith(mot) || distance(mot, w.slice(0, mot.length + 1)) <= tolerance || distance(mot, w) <= tolerance);
}

function indexer(p: Produit) {
  const texte = [p.nom, p.marque, p.type, p.famille, p.genre, ...p.pyramide.tete, ...p.pyramide.coeur, ...p.pyramide.fond, ...p.tags].join(" ");
  return normaliser(texte).split(/\s+/).filter(Boolean);
}

export function rechercher(produits: Produit[], requete: string): Produit[] {
  const mots = normaliser(requete).split(/\s+/).filter(Boolean);
  if (!mots.length) return [];
  return produits
    .map((p) => ({ produit: p, mots: indexer(p), nom: normaliser(p.nom) }))
    .filter((e) => mots.every((m) => motCorrespond(m, e.mots)))
    .sort((a, b) => Number(b.nom.includes(mots[0])) - Number(a.nom.includes(mots[0])))
    .map((e) => e.produit);
}

export const suggestions = ["Chanel", "Oud", "Rose", "Vanille", "Ambre", "Musc", "Encens", "Versace"];
