"use server";

// Création des commandes depuis le site public.
// Les prix, frais, remises et stocks sont toujours recalculés ici, côté serveur :
// le navigateur ne peut pas les modifier.
import { randomBytes } from "node:crypto";
import { lireBase, modifierBase, type Base } from "../db";
import type { CodePromo, Commande, MoyenPaiement } from "../site";

export interface DemandeCommande {
  lignes: { slug: string; contenance: string; quantite: number }[];
  client: { nom: string; telephone: string; adresse: string; repere: string };
  zone: string;
  moyen: MoyenPaiement;
  code: string;
  echantillon: string | null;
  message: string;
}

function calculRemise(code: CodePromo | undefined, sousTotal: number) {
  if (!code || !code.actif || sousTotal < code.minimum) return 0;
  return code.type === "pourcentage" ? Math.round((sousTotal * code.valeur) / 100) : Math.min(code.valeur, sousTotal);
}

function trouverCode(base: Base, code: string) {
  const c = code.trim().toUpperCase();
  return c ? base.codes.find((x) => x.code.toUpperCase() === c) : undefined;
}

export async function verifierCode(code: string, sousTotal: number) {
  const base = await lireBase();
  const c = trouverCode(base, code);
  if (!c || !c.actif) return { ok: false as const, message: "Ce code n'est pas valable." };
  if (sousTotal < c.minimum) return { ok: false as const, message: `Code valable dès ${c.minimum.toLocaleString("fr-FR")} FCFA d'achat.` };
  return { ok: true as const, code: c.code, remise: calculRemise(c, sousTotal) };
}

export async function passerCommande(d: DemandeCommande): Promise<{ ok: true; numero: string } | { ok: false; message: string }> {
  const nom = d.client.nom.trim();
  const telephone = d.client.telephone.replace(/[^\d+]/g, "");
  if (!nom || telephone.length < 9) return { ok: false, message: "Nom et téléphone obligatoires." };
  if (!d.lignes.length) return { ok: false, message: "Votre panier est vide." };

  try {
    return await modifierBase((base) => {
      const r = base.reglages;
      const zone = r.livraison.zones.find((z) => z.id === d.zone && z.actif);
      if (!zone) throw new Error("Zone de livraison indisponible.");
      if (!r.paiements[d.moyen]) throw new Error("Moyen de paiement indisponible.");
      if (zone.id !== "boutique" && !d.client.adresse.trim()) throw new Error("Adresse de livraison obligatoire.");

      const lignes = d.lignes.map((l) => {
        const p = base.produits.find((x) => x.slug === l.slug && x.publie !== false);
        const c = p?.contenances.find((x) => x.label === l.contenance);
        const quantite = Math.max(1, Math.floor(l.quantite));
        if (!p || !c) throw new Error("Un produit de votre panier n'est plus disponible.");
        if (c.stock < quantite) throw new Error(`Stock insuffisant pour ${p.nom} (${c.label}) : ${c.stock} disponible(s).`);
        return { p, c, quantite };
      });

      // Réservation du stock
      lignes.forEach(({ c, quantite }) => (c.stock -= quantite));

      const sousTotal = lignes.reduce((n, l) => n + l.c.prix * l.quantite, 0);
      const code = trouverCode(base, d.code);
      const remise = calculRemise(code, sousTotal);
      if (remise && code) code.utilisations += 1;
      const frais = zone.gratuiteDes && sousTotal >= zone.gratuiteDes ? 0 : zone.frais;

      let numero = "";
      do numero = `SF-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;
      while (base.commandes.some((c) => c.numero === numero));

      // Paiement simulé : Mobile Money et carte sont considérés comme payés
      // (l'agrégateur confirmera par webhook une fois branché) ; à la livraison, en attente.
      const paye = d.moyen !== "livraison";
      const maintenant = new Date().toISOString();
      const commande: Commande = {
        numero,
        date: maintenant,
        canal: "site",
        client: { nom, telephone, adresse: d.client.adresse.trim(), repere: d.client.repere.trim() },
        lignes: lignes.map(({ p, c, quantite }) => ({
          slug: p.slug,
          nom: p.nom,
          marque: p.marque,
          contenance: c.label,
          prix: c.prix,
          quantite,
          image: p.images[0] ?? "",
        })),
        sousTotal,
        remise,
        code: remise ? (code?.code ?? null) : null,
        zone: { id: zone.id, label: zone.label, frais },
        total: sousTotal - remise + frais,
        paiement: { moyen: d.moyen, statut: paye ? "paye" : "en_attente", reference: paye ? `SIM-${numero}` : null },
        statut: paye ? "payee" : "en_attente",
        historique: [
          { date: maintenant, statut: "en_attente", note: "Commande reçue sur le site" },
          ...(paye ? [{ date: maintenant, statut: "payee" as const, note: "Paiement confirmé" }] : []),
        ],
        echantillon: d.echantillon,
        message: d.message.trim(),
        livreur: "",
        notes: "",
      };
      base.commandes.unshift(commande);
      return { ok: true as const, numero };
    });
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Erreur inattendue." };
  }
}
