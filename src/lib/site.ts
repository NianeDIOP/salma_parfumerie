// Modèle de tout ce qui est gérable depuis l'administration :
// identité, couleurs, en-tête, pied de page, sections d'accueil, pages, livraison,
// paiements, codes promo, commandes. Partagé entre le site public et l'admin.

import type { Produit, Univers } from "./catalogue";

export interface Lien {
  label: string;
  href: string;
}

export type Police = "schibsted" | "bricolage" | "playfair" | "dmsans";

export const polices: { id: Police; nom: string }[] = [
  { id: "schibsted", nom: "Schibsted Grotesk (moderne)" },
  { id: "bricolage", nom: "Bricolage Grotesque (expressive)" },
  { id: "playfair", nom: "Playfair Display (classique luxe)" },
  { id: "dmsans", nom: "DM Sans (douce)" },
];

export interface Couleurs {
  primaire: string; // rouge bissap
  primaireFonce: string;
  secondaire: string; // bleu nuit
  accent: string; // rose poudré
  fond: string; // crème
  fondClair: string;
  texte: string;
  texteDoux: string;
  ligne: string;
}

// ---------- Sections de la page d'accueil ----------

interface SectionBase {
  id: string;
  visible: boolean;
}

export interface SectionHero extends SectionBase {
  type: "hero";
  produits: string[];
  duree: number; // secondes
  boutonDecouvrir: string;
}
export interface SectionPastilles extends SectionBase {
  type: "pastilles";
  afficherCoffrets: boolean;
}
export interface SectionMarques extends SectionBase {
  type: "marques";
  marques: string[];
}
export interface SectionTexte extends SectionBase {
  type: "manifeste";
  titre: string;
  texte: string;
  bouton: Lien;
}
export interface SectionUnivers extends SectionBase {
  type: "univers";
  titre: string;
  titreAccent: string;
}
export interface SectionProduits extends SectionBase {
  type: "produits";
  titre: string;
  texte: string;
  mode: "meilleures-ventes" | "selection" | "univers" | "marque";
  produits: string[];
  univers: string;
  marque: string;
  nombre: number;
  lien: Lien;
}
export interface SectionFamilles extends SectionBase {
  type: "familles";
  items: { titre: string; texte: string; produit: string }[];
}
export interface SectionEditorial extends SectionBase {
  type: "editorial";
  titre: string;
  texte: string;
  image: string;
  bouton: Lien;
}
export interface SectionReassurance extends SectionBase {
  type: "reassurance";
  items: { icone: string; titre: string; texte: string }[];
}

export type Section =
  | SectionHero
  | SectionPastilles
  | SectionMarques
  | SectionTexte
  | SectionUnivers
  | SectionProduits
  | SectionFamilles
  | SectionEditorial
  | SectionReassurance;

export const typesSections: { type: Section["type"]; nom: string; description: string }[] = [
  { type: "hero", nom: "Hero (carrousel)", description: "Grand carrousel de parfums vedettes, aux couleurs de chaque produit" },
  { type: "pastilles", nom: "Univers en pastilles", description: "Ronds cliquables des univers (mobile)" },
  { type: "marques", nom: "Bandeau de marques", description: "Noms de marques en grand, qui défilent" },
  { type: "manifeste", nom: "Texte + bouton", description: "Grand titre, paragraphe et lien" },
  { type: "univers", nom: "Grille des univers", description: "Les univers en grandes cartes photo" },
  { type: "produits", nom: "Rangée de produits", description: "Meilleures ventes, sélection, univers ou marque" },
  { type: "familles", nom: "Familles olfactives", description: "Sections colorées, une par parfum mis en avant" },
  { type: "editorial", nom: "Grande image + appel", description: "Photo pleine largeur avec titre et bouton" },
  { type: "reassurance", nom: "Réassurance", description: "Chiffres et engagements (livraison, paiement…)" },
];

// ---------- Pages libres (CGV, FAQ, livraison…) ----------

export interface PageLibre {
  slug: string;
  titre: string;
  contenu: string; // texte simple : paragraphes séparés par une ligne vide, « ## » pour un sous-titre
  publie: boolean;
}

// ---------- Livraison, paiements, promotions ----------

export interface ZoneLivraison {
  id: string;
  label: string;
  delai: string;
  frais: number;
  gratuiteDes: number | null; // offerte à partir de ce montant (null : jamais)
  actif: boolean;
}

export type MoyenPaiement = "wave" | "om" | "free" | "carte" | "livraison";

export const moyensPaiement: { id: MoyenPaiement; label: string; sigle: string; couleur: string; detail?: string }[] = [
  { id: "wave", label: "Wave", sigle: "W", couleur: "#1dc8f2" },
  { id: "om", label: "Orange Money", sigle: "OM", couleur: "#ff7900" },
  { id: "free", label: "Free Money", sigle: "FM", couleur: "#d6001c" },
  { id: "carte", label: "Carte bancaire", sigle: "CB", couleur: "#1a1a1a", detail: "Visa · Mastercard" },
  { id: "livraison", label: "Paiement à la livraison", sigle: "€", couleur: "#6e7f5b", detail: "Espèces ou Mobile Money" },
];

export interface CodePromo {
  code: string;
  type: "pourcentage" | "montant";
  valeur: number;
  actif: boolean;
  minimum: number;
  utilisations: number;
}

// ---------- Commandes ----------

export type StatutCommande = "en_attente" | "payee" | "preparation" | "expediee" | "livree" | "annulee" | "remboursee";

export const statuts: { id: StatutCommande; label: string; couleur: string }[] = [
  { id: "en_attente", label: "En attente", couleur: "#d9a521" },
  { id: "payee", label: "Payée", couleur: "#2f8f5b" },
  { id: "preparation", label: "En préparation", couleur: "#3b6fd1" },
  { id: "expediee", label: "En livraison", couleur: "#8a4fd1" },
  { id: "livree", label: "Livrée", couleur: "#1a1a1a" },
  { id: "annulee", label: "Annulée", couleur: "#9a9a9a" },
  { id: "remboursee", label: "Remboursée", couleur: "#c0392b" },
];

// Étapes suivantes possibles depuis chaque statut (processus de commande jusqu'à la livraison)
export const transitions: Record<StatutCommande, StatutCommande[]> = {
  en_attente: ["payee", "annulee"],
  payee: ["preparation", "remboursee", "annulee"],
  preparation: ["expediee", "annulee"],
  expediee: ["livree"],
  livree: ["remboursee"],
  annulee: [],
  remboursee: [],
};

export interface LigneCommande {
  slug: string;
  nom: string;
  marque: string;
  contenance: string;
  prix: number;
  quantite: number;
  image: string;
}

export interface Commande {
  numero: string;
  date: string;
  canal: "site" | "boutique" | "whatsapp";
  client: { nom: string; telephone: string; adresse: string; repere: string };
  lignes: LigneCommande[];
  sousTotal: number;
  remise: number;
  code: string | null;
  zone: { id: string; label: string; frais: number };
  total: number;
  paiement: { moyen: MoyenPaiement; statut: "en_attente" | "paye" | "rembourse"; reference: string | null };
  statut: StatutCommande;
  historique: { date: string; statut: StatutCommande; note: string }[];
  echantillon: string | null;
  message: string;
  livreur: string;
  notes: string;
}

// ---------- Administrateurs ----------

export interface Admin {
  email: string;
  nom: string;
  hash: string;
}

// ---------- Réglages du site ----------

export interface Reglages {
  identite: {
    nom: string;
    logo: string;
    sousTitre: string;
    slogan: string;
    couleurs: Couleurs;
    police: Police;
    curseur: boolean;
    transitionPages: boolean;
  };
  contact: { whatsapp: string; telephone: string; email: string; adresse: string; horaires: string };
  entete: {
    liens: Lien[];
    bouton: Lien & { visible: boolean };
    afficherCompte: boolean;
    afficherFavoris: boolean;
  };
  mobile: { onglets: { accueil: string; boutique: string; signature: string; favoris: string; panier: string } };
  pied: {
    description: string;
    colonnes: { titre: string; liens: Lien[] }[];
    paiements: string[];
    copyright: string;
    newsletter: { visible: boolean; placeholder: string; bouton: string };
    grandLogo: boolean;
  };
  accueil: Section[];
  pages: PageLibre[];
  livraison: { zones: ZoneLivraison[]; echantillonOffert: boolean };
  paiements: Record<MoyenPaiement, boolean>;
  seo: { titre: string; description: string };
  boutique: { texteVide: string; messageConfirmation: string; paiementEnPlusieursFois: boolean };
}

// ---------- Données exposées au site public ----------

export interface DonneesSite {
  reglages: Omit<Reglages, "pages"> & { pages: Pick<PageLibre, "slug" | "titre" | "publie">[] };
  produits: Produit[];
  univers: Univers[];
}

export function nouvelId(prefixe = "s") {
  return `${prefixe}-${Math.random().toString(36).slice(2, 9)}`;
}
