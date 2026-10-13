"use server";

// Actions de l'administration. Chacune vérifie d'abord que l'administrateur est connecté.
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConnecte, exigerAdmin, fermerSession, ouvrirSession } from "../auth";
import type { Produit, Univers } from "../catalogue";
import { DOSSIER_DONNEES, lireBase, modifierBase } from "../db";
import { hacherMotDePasse, verifierMotDePasse } from "../password";
import { slugifier } from "../slug";
import { reglagesParDefaut } from "../seed";
import { transitions, type CodePromo, type Commande, type MoyenPaiement, type Reglages, type StatutCommande } from "../site";

type Resultat = { ok: true; message?: string } | { ok: false; message: string };

function rafraichir() {
  revalidatePath("/", "layout");
}

async function proteger<T>(action: () => Promise<T>): Promise<T | Resultat> {
  await exigerAdmin();
  try {
    const r = await action();
    rafraichir();
    return r;
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Erreur inattendue." };
  }
}

// ---------- Connexion ----------

export async function connexion(_etat: { erreur: string; email: string } | null, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(form.get("motDePasse") ?? "");
  const admin = (await lireBase()).admins.find((a) => a.email.toLowerCase() === email);
  // Délai constant pour ne pas révéler si l'adresse existe
  await new Promise((r) => setTimeout(r, 400));
  if (!admin || !verifierMotDePasse(motDePasse, admin.hash)) return { erreur: "Adresse ou mot de passe incorrect.", email };
  await ouvrirSession(admin.email);
  redirect("/admin");
}

export async function deconnexion() {
  await fermerSession();
  redirect("/admin/connexion");
}

// ---------- Réglages du site (apparence, accueil, pages, livraison, paiements…) ----------

export async function enregistrerReglages(partiel: Partial<Reglages>): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      b.reglages = { ...b.reglages, ...partiel };
    });
    return { ok: true, message: "Modifications enregistrées et publiées." };
  });
}

export async function restaurerReglages(cle: keyof Reglages): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      (b.reglages as unknown as Record<string, unknown>)[cle] = structuredClone(reglagesParDefaut[cle]);
    });
    return { ok: true, message: "Valeurs par défaut restaurées." };
  });
}

// ---------- Produits ----------

export async function enregistrerProduit(produit: Produit, ancienSlug: string | null): Promise<Resultat & { slug?: string }> {
  return proteger(async () => {
    const slug = slugifier(produit.slug || `${produit.marque}-${produit.nom}`);
    if (!slug) throw new Error("Donnez un nom au produit.");
    if (!produit.nom.trim()) throw new Error("Le nom est obligatoire.");
    if (!produit.contenances.length) throw new Error("Ajoutez au moins une contenance avec un prix.");
    await modifierBase((b) => {
      if (slug !== ancienSlug && b.produits.some((p) => p.slug === slug)) throw new Error("Un autre produit utilise déjà cette adresse (slug).");
      const propre: Produit = {
        ...produit,
        slug,
        contenances: produit.contenances.map((c) => ({ label: c.label.trim(), prix: Math.max(0, Math.round(c.prix)), stock: Math.max(0, Math.round(c.stock)) })),
        images: produit.images.map((i) => i.trim()).filter(Boolean),
      };
      const i = ancienSlug ? b.produits.findIndex((p) => p.slug === ancienSlug) : -1;
      if (i >= 0) b.produits[i] = propre;
      else b.produits.unshift(propre);
      // Si l'adresse change, mettre à jour les sections d'accueil qui citent ce produit
      if (ancienSlug && ancienSlug !== slug) {
        const remplacer = (s: string) => (s === ancienSlug ? slug : s);
        b.reglages.accueil = b.reglages.accueil.map((sec) => {
          if (sec.type === "hero" || sec.type === "produits") return { ...sec, produits: sec.produits.map(remplacer) };
          if (sec.type === "familles") return { ...sec, items: sec.items.map((it) => ({ ...it, produit: remplacer(it.produit) })) };
          return sec;
        });
      }
    });
    return { ok: true, message: "Produit enregistré.", slug };
  });
}

export async function supprimerProduit(slug: string): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      b.produits = b.produits.filter((p) => p.slug !== slug);
    });
    return { ok: true, message: "Produit supprimé." };
  });
}

export async function dupliquerProduit(slug: string): Promise<Resultat & { slug?: string }> {
  return proteger(async () => {
    const nouveau = await modifierBase((b) => {
      const p = b.produits.find((x) => x.slug === slug);
      if (!p) throw new Error("Produit introuvable.");
      let s = `${slug}-copie`;
      let n = 2;
      while (b.produits.some((x) => x.slug === s)) s = `${slug}-copie-${n++}`;
      b.produits.unshift({ ...structuredClone(p), slug: s, nom: `${p.nom} (copie)`, publie: false });
      return s;
    });
    return { ok: true, message: "Produit dupliqué (brouillon).", slug: nouveau };
  });
}

export async function majProduitRapide(slug: string, champs: Partial<Pick<Produit, "publie" | "badge">>): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      const p = b.produits.find((x) => x.slug === slug);
      if (p) Object.assign(p, champs);
    });
    return { ok: true };
  });
}

export async function majStocks(modifs: { slug: string; contenance: string; stock?: number; prix?: number }[]): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      for (const m of modifs) {
        const c = b.produits.find((p) => p.slug === m.slug)?.contenances.find((x) => x.label === m.contenance);
        if (!c) continue;
        if (m.stock !== undefined) c.stock = Math.max(0, Math.round(m.stock));
        if (m.prix !== undefined) c.prix = Math.max(0, Math.round(m.prix));
      }
    });
    return { ok: true, message: "Stocks et prix mis à jour." };
  });
}

// Ajuste tous les prix (ou ceux d'un univers / d'une marque) d'un pourcentage
export async function ajusterPrix(pourcentage: number, filtre: { univers?: string; marque?: string }): Promise<Resultat> {
  return proteger(async () => {
    const n = await modifierBase((b) => {
      let compte = 0;
      for (const p of b.produits) {
        if (filtre.univers && p.univers !== filtre.univers) continue;
        if (filtre.marque && p.marque !== filtre.marque) continue;
        p.contenances.forEach((c) => (c.prix = Math.round((c.prix * (1 + pourcentage / 100)) / 100) * 100));
        compte++;
      }
      return compte;
    });
    return { ok: true, message: `Prix ajustés sur ${n} produit(s).` };
  });
}

// ---------- Univers (catégories) ----------

export async function enregistrerUnivers(liste: Univers[]): Promise<Resultat> {
  return proteger(async () => {
    const propres = liste.map((u) => ({ ...u, slug: slugifier(u.slug || u.nom) }));
    if (propres.some((u) => !u.slug || !u.nom.trim())) throw new Error("Chaque univers doit avoir un nom.");
    if (new Set(propres.map((u) => u.slug)).size !== propres.length) throw new Error("Deux univers ont la même adresse.");
    const reserves = ["admin", "boutique", "favoris", "panier", "quiz", "compte", "coffrets", "pages", "commande", "media"];
    if (propres.some((u) => reserves.includes(u.slug))) throw new Error("Cette adresse est réservée par le site.");
    await modifierBase((b) => {
      b.univers = propres;
    });
    return { ok: true, message: "Univers enregistrés." };
  });
}

// ---------- Commandes ----------

function rendreStock(b: { produits: Produit[] }, c: Commande) {
  for (const l of c.lignes) {
    const cont = b.produits.find((p) => p.slug === l.slug)?.contenances.find((x) => x.label === l.contenance);
    if (cont) cont.stock += l.quantite;
  }
}

export async function changerStatut(numero: string, statut: StatutCommande, note: string): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      const c = b.commandes.find((x) => x.numero === numero);
      if (!c) throw new Error("Commande introuvable.");
      if (!transitions[c.statut].includes(statut)) throw new Error("Cette étape n'est pas possible depuis le statut actuel.");
      // Annulation avant livraison : le stock réservé est rendu
      if ((statut === "annulee" || statut === "remboursee") && c.statut !== "livree") rendreStock(b, c);
      if (statut === "payee") c.paiement.statut = "paye";
      if (statut === "remboursee") c.paiement.statut = "rembourse";
      if (statut === "livree" && c.paiement.moyen === "livraison") c.paiement.statut = "paye";
      c.statut = statut;
      c.historique.push({ date: new Date().toISOString(), statut, note: note.trim() });
    });
    return { ok: true, message: "Statut mis à jour." };
  });
}

export async function majCommande(numero: string, champs: Partial<Pick<Commande, "livreur" | "notes">> & { paiementStatut?: Commande["paiement"]["statut"] }): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      const c = b.commandes.find((x) => x.numero === numero);
      if (!c) throw new Error("Commande introuvable.");
      if (champs.livreur !== undefined) c.livreur = champs.livreur;
      if (champs.notes !== undefined) c.notes = champs.notes;
      if (champs.paiementStatut) c.paiement.statut = champs.paiementStatut;
    });
    return { ok: true, message: "Commande mise à jour." };
  });
}

export async function supprimerCommande(numero: string): Promise<Resultat> {
  return proteger(async () => {
    await modifierBase((b) => {
      const c = b.commandes.find((x) => x.numero === numero);
      if (c && !["annulee", "remboursee", "livree"].includes(c.statut)) rendreStock(b, c);
      b.commandes = b.commandes.filter((x) => x.numero !== numero);
    });
    return { ok: true, message: "Commande supprimée." };
  });
}

// Vente saisie à la main (boutique ou WhatsApp) : elle alimente le même stock et les mêmes statistiques
export async function creerVente(v: {
  canal: "boutique" | "whatsapp";
  client: Commande["client"];
  lignes: { slug: string; contenance: string; quantite: number }[];
  zone: string;
  moyen: MoyenPaiement;
  remise: number;
  payee: boolean;
  notes: string;
}): Promise<Resultat & { numero?: string }> {
  return proteger(async () => {
    if (!v.lignes.length) throw new Error("Ajoutez au moins un produit.");
    const numero = await modifierBase((b) => {
      const zone = b.reglages.livraison.zones.find((z) => z.id === v.zone) ?? { id: "boutique", label: "Vente en boutique", frais: 0 };
      const lignes = v.lignes.map((l) => {
        const p = b.produits.find((x) => x.slug === l.slug);
        const c = p?.contenances.find((x) => x.label === l.contenance);
        if (!p || !c) throw new Error("Produit introuvable.");
        if (c.stock < l.quantite) throw new Error(`Stock insuffisant : ${p.nom} ${c.label} (${c.stock}).`);
        c.stock -= l.quantite;
        return { slug: p.slug, nom: p.nom, marque: p.marque, contenance: c.label, prix: c.prix, quantite: l.quantite, image: p.images[0] ?? "" };
      });
      const sousTotal = lignes.reduce((n, l) => n + l.prix * l.quantite, 0);
      const remise = Math.min(Math.max(0, Math.round(v.remise)), sousTotal);
      const frais = zone.id === "boutique" ? 0 : zone.frais;
      let numero = "";
      do numero = `SF-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;
      while (b.commandes.some((c) => c.numero === numero));
      const maintenant = new Date().toISOString();
      b.commandes.unshift({
        numero,
        date: maintenant,
        canal: v.canal,
        client: v.client,
        lignes,
        sousTotal,
        remise,
        code: null,
        zone: { id: zone.id, label: zone.label, frais },
        total: sousTotal - remise + frais,
        paiement: { moyen: v.moyen, statut: v.payee ? "paye" : "en_attente", reference: null },
        statut: v.payee ? (zone.id === "boutique" ? "livree" : "payee") : "en_attente",
        historique: [{ date: maintenant, statut: v.payee ? (zone.id === "boutique" ? "livree" : "payee") : "en_attente", note: v.canal === "boutique" ? "Vente en boutique" : "Commande WhatsApp" }],
        echantillon: null,
        message: "",
        livreur: "",
        notes: v.notes,
      });
      return numero;
    });
    return { ok: true, message: "Vente enregistrée.", numero };
  });
}

// ---------- Codes promo ----------

export async function enregistrerCodes(codes: CodePromo[]): Promise<Resultat> {
  return proteger(async () => {
    const propres = codes.map((c) => ({ ...c, code: c.code.trim().toUpperCase().replace(/\s+/g, "") })).filter((c) => c.code);
    if (new Set(propres.map((c) => c.code)).size !== propres.length) throw new Error("Deux codes identiques.");
    await modifierBase((b) => {
      b.codes = propres;
    });
    return { ok: true, message: "Codes promo enregistrés." };
  });
}

// ---------- Images ----------

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

export async function envoyerImage(form: FormData): Promise<Resultat & { url?: string }> {
  return proteger(async () => {
    const fichier = form.get("fichier");
    if (!(fichier instanceof File) || !fichier.size) throw new Error("Aucun fichier.");
    if (fichier.size > 8 * 1024 * 1024) throw new Error("Image trop lourde (8 Mo maximum).");
    const ext = path.extname(fichier.name).toLowerCase();
    if (!EXTENSIONS.includes(ext) || !fichier.type.startsWith("image/")) throw new Error("Format accepté : JPG, PNG, WebP, AVIF ou GIF.");
    const nom = `${Date.now()}-${randomBytes(3).toString("hex")}${ext}`;
    const dossier = path.join(DOSSIER_DONNEES, "uploads");
    await fs.mkdir(dossier, { recursive: true });
    await fs.writeFile(path.join(dossier, nom), Buffer.from(await fichier.arrayBuffer()));
    return { ok: true, message: "Image envoyée.", url: `/media/${nom}` };
  });
}

// ---------- Administrateurs ----------

export async function ajouterAdmin(email: string, nom: string, motDePasse: string): Promise<Resultat> {
  return proteger(async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error("Adresse e-mail invalide.");
    if (motDePasse.length < 8) throw new Error("Mot de passe : 8 caractères minimum.");
    await modifierBase((b) => {
      if (b.admins.some((a) => a.email === e)) throw new Error("Cet administrateur existe déjà.");
      b.admins.push({ email: e, nom: nom.trim() || e, hash: hacherMotDePasse(motDePasse) });
    });
    return { ok: true, message: "Administrateur ajouté." };
  });
}

export async function supprimerAdmin(email: string): Promise<Resultat> {
  return proteger(async () => {
    const moi = await adminConnecte();
    if (moi?.email === email) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
    await modifierBase((b) => {
      if (b.admins.length <= 1) throw new Error("Il faut au moins un administrateur.");
      b.admins = b.admins.filter((a) => a.email !== email);
    });
    return { ok: true, message: "Administrateur supprimé." };
  });
}

export async function changerMotDePasse(actuel: string, nouveau: string): Promise<Resultat> {
  return proteger(async () => {
    const moi = await adminConnecte();
    if (nouveau.length < 8) throw new Error("Nouveau mot de passe : 8 caractères minimum.");
    await modifierBase((b) => {
      const a = b.admins.find((x) => x.email === moi?.email);
      if (!a || !verifierMotDePasse(actuel, a.hash)) throw new Error("Mot de passe actuel incorrect.");
      a.hash = hacherMotDePasse(nouveau);
    });
    return { ok: true, message: "Mot de passe modifié." };
  });
}
