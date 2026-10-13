// Sessions administrateur : cookie signé (HMAC-SHA256), httpOnly, valable 7 jours.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DOSSIER_DONNEES, lireBase } from "./db";

export const COOKIE_ADMIN = "salma_admin";
const DUREE = 7 * 24 * 3600;

let secretMemo: string | null = null;
async function secret() {
  if (process.env.SALMA_SECRET) return process.env.SALMA_SECRET;
  if (secretMemo) return secretMemo;
  const fichier = path.join(DOSSIER_DONNEES, ".secret");
  try {
    secretMemo = (await fs.readFile(fichier, "utf8")).trim();
  } catch {
    secretMemo = randomBytes(32).toString("hex");
    await fs.mkdir(DOSSIER_DONNEES, { recursive: true });
    await fs.writeFile(fichier, secretMemo, { mode: 0o600 });
  }
  return secretMemo;
}

async function signer(valeur: string) {
  return createHmac("sha256", await secret()).update(valeur).digest("base64url");
}

export async function ouvrirSession(email: string) {
  const charge = Buffer.from(JSON.stringify({ email, exp: Date.now() + DUREE * 1000 })).toString("base64url");
  const jeton = `${charge}.${await signer(charge)}`;
  // Cookie « sécurisé » uniquement si le site est servi en https (sinon le navigateur le refuserait,
  // par exemple en test sur le Wi-Fi local)
  const https = (await headers()).get("x-forwarded-proto")?.split(",")[0].trim() === "https";
  (await cookies()).set(COOKIE_ADMIN, jeton, {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: DUREE,
  });
}

export async function fermerSession() {
  (await cookies()).delete(COOKIE_ADMIN);
}

// Renvoie l'administrateur connecté, ou null
export async function adminConnecte() {
  const jeton = (await cookies()).get(COOKIE_ADMIN)?.value;
  if (!jeton) return null;
  const [charge, signature] = jeton.split(".");
  if (!charge || !signature) return null;
  const attendue = Buffer.from(await signer(charge));
  const recue = Buffer.from(signature);
  if (attendue.length !== recue.length || !timingSafeEqual(attendue, recue)) return null;
  try {
    const { email, exp } = JSON.parse(Buffer.from(charge, "base64url").toString()) as { email: string; exp: number };
    if (Date.now() > exp) return null;
    const admin = (await lireBase()).admins.find((a) => a.email === email);
    return admin ? { email: admin.email, nom: admin.nom } : null;
  } catch {
    return null;
  }
}

// À appeler en tête de chaque page et action d'administration
export async function exigerAdmin() {
  const admin = await adminConnecte();
  if (!admin) redirect("/admin/connexion");
  return admin;
}
