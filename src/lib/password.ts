import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Mots de passe hachés avec scrypt et un sel aléatoire (jamais stockés en clair).
export function hacherMotDePasse(motDePasse: string) {
  const sel = randomBytes(16).toString("hex");
  const hash = scryptSync(motDePasse, sel, 64).toString("hex");
  return `${sel}:${hash}`;
}

export function verifierMotDePasse(motDePasse: string, stocke: string) {
  const [sel, hash] = stocke.split(":");
  if (!sel || !hash) return false;
  const calcule = scryptSync(motDePasse, sel, 64);
  const attendu = Buffer.from(hash, "hex");
  return attendu.length === calcule.length && timingSafeEqual(attendu, calcule);
}
