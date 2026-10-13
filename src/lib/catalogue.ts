// Catalogue de démonstration, repris des maquettes LAS COM.
// Il sera remplacé par l'API e-commerce (Medusa/NestJS) en phase back-office.

export type UniversSlug = "parfums" | "huiles" | "cosmetiques" | "maison";

export type FlaconForme = "carre" | "rond" | "octogone" | "fin" | "pot" | "diffuseur" | "bougie";

export type Famille = "Oriental" | "Boisé" | "Floral" | "Ambré" | "Frais / Hespéridé" | "Fruité" | "Musqué";

export type Genre = "Femme" | "Homme" | "Mixte";

export type Occasion = "Soirée" | "Bureau" | "Cérémonie" | "Quotidien" | "Tabaski";

export interface Contenance {
  label: string;
  prix: number;
  stock: number;
}

export interface Produit {
  slug: string;
  nom: string;
  univers: UniversSlug;
  type: string;
  famille: Famille;
  genre: Genre;
  intensite: 1 | 2 | 3 | 4;
  occasions: Occasion[];
  description: string;
  pyramide: { tete: string[]; coeur: string[]; fond: string[] };
  tenue: { valeur: number; label: string };
  sillage: { valeur: number; label: string };
  saison: { valeur: number; label: string };
  tags: string[];
  badge?: "Best-seller" | "Nouveau" | "Édition limitée" | "Coup de cœur";
  note: number;
  avis: number;
  contenances: Contenance[];
  visuel: { forme: FlaconForme; verre: string; bouchon: string; fond: string };
}

export interface Univers {
  slug: UniversSlug;
  nom: string;
  accroche: string;
  description: string;
  couleur: string;
  texte: string;
}

export const univers: Univers[] = [
  {
    slug: "parfums",
    nom: "Parfums",
    accroche: "Eaux de parfum & extraits",
    description: "Eaux de parfum, extraits et eaux de toilette, composés pour signer chacun de vos instants.",
    couleur: "var(--color-bissap)",
    texte: "#fff",
  },
  {
    slug: "huiles",
    nom: "Huiles parfumées",
    accroche: "Thiouraye, musc & encens",
    description: "Huiles corps et cheveux, thiouraye et encens : les senteurs de la maison, en version précieuse.",
    couleur: "var(--color-nuit)",
    texte: "#fff",
  },
  {
    slug: "cosmetiques",
    nom: "Cosmétiques",
    accroche: "Soins parfumés du corps",
    description: "Crèmes, laits, gels douche et brumes : prolonger le sillage, du matin au soir.",
    couleur: "var(--color-terracotta)",
    texte: "#fff",
  },
  {
    slug: "maison",
    nom: "Maison",
    accroche: "Bougies & diffuseurs",
    description: "Bougies, diffuseurs, sprays d'ambiance et encens pour parfumer chaque pièce.",
    couleur: "var(--color-sauge)",
    texte: "#fff",
  },
];

const parfums: Produit[] = [
  {
    slug: "nuit-de-teranga",
    nom: "Nuit de Téranga",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 4,
    occasions: ["Soirée", "Cérémonie"],
    description:
      "Un sillage chaleureux et magnétique, inspiré des nuits d'hospitalité sénégalaise. L'oud fumé s'enlace à la rose de Taïf, réchauffé par l'ambre et la vanille.",
    pyramide: { tete: ["Bergamote", "Mandarine", "Poivre rose"], coeur: ["Rose de Taïf", "Jasmin", "Safran"], fond: ["Oud", "Ambre", "Vanille", "Musc"] },
    tenue: { valeur: 90, label: "10 h" },
    sillage: { valeur: 75, label: "Marqué" },
    saison: { valeur: 60, label: "Automne · Hiver" },
    tags: ["Soirée", "Cérémonie", "Magnétique", "Chaleureux"],
    badge: "Best-seller",
    note: 4.9,
    avis: 218,
    contenances: [
      { label: "30 ml", prix: 29500, stock: 20 },
      { label: "50 ml", prix: 49500, stock: 12 },
      { label: "100 ml", prix: 78000, stock: 6 },
    ],
    visuel: { forme: "carre", verre: "#2c3466", bouchon: "#141414", fond: "#dfe3f3" },
  },
  {
    slug: "ambre-royal",
    nom: "Ambre Royal",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Ambré",
    genre: "Mixte",
    intensite: 3,
    occasions: ["Soirée", "Quotidien"],
    description: "Un ambre doré et enveloppant, adouci par une vanille de Madagascar et une touche de benjoin.",
    pyramide: { tete: ["Cardamome", "Orange douce"], coeur: ["Ambre", "Fleur d'oranger"], fond: ["Vanille", "Benjoin", "Santal"] },
    tenue: { valeur: 80, label: "8 h" },
    sillage: { valeur: 65, label: "Présent" },
    saison: { valeur: 55, label: "Toutes saisons" },
    tags: ["Doux", "Enveloppant", "Quotidien"],
    badge: "Nouveau",
    note: 4.8,
    avis: 96,
    contenances: [
      { label: "50 ml", prix: 42000, stock: 18 },
      { label: "100 ml", prix: 66000, stock: 9 },
    ],
    visuel: { forme: "octogone", verre: "#c98a2b", bouchon: "#141414", fond: "#f4e6d0" },
  },
  {
    slug: "oud-majeste",
    nom: "Oud Majesté",
    univers: "parfums",
    type: "Extrait de parfum",
    famille: "Boisé",
    genre: "Homme",
    intensite: 4,
    occasions: ["Soirée", "Cérémonie", "Tabaski"],
    description: "L'oud dans sa forme la plus noble : boisé intense, cuir fumé et encens pour les grandes occasions.",
    pyramide: { tete: ["Safran", "Poivre noir"], coeur: ["Oud", "Cuir", "Encens"], fond: ["Patchouli", "Ambre gris", "Musc"] },
    tenue: { valeur: 95, label: "12 h +" },
    sillage: { valeur: 85, label: "Puissant" },
    saison: { valeur: 70, label: "Automne · Hiver" },
    tags: ["Cérémonie", "Intense", "Noble"],
    badge: "Édition limitée",
    note: 4.9,
    avis: 74,
    contenances: [
      { label: "50 ml", prix: 65000, stock: 2 },
      { label: "100 ml", prix: 98000, stock: 4 },
    ],
    visuel: { forme: "fin", verre: "#4a2f24", bouchon: "#1f2a5c", fond: "#e9e2db" },
  },
  {
    slug: "rose-de-saloum",
    nom: "Rose de Saloum",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Floral",
    genre: "Femme",
    intensite: 2,
    occasions: ["Quotidien", "Bureau"],
    description: "Une rose poudrée et lumineuse, comme un matin sur le delta du Saloum. Fraîche, féminine, élégante.",
    pyramide: { tete: ["Litchi", "Bergamote"], coeur: ["Rose", "Pivoine", "Iris"], fond: ["Musc blanc", "Cèdre"] },
    tenue: { valeur: 65, label: "6 h" },
    sillage: { valeur: 50, label: "Délicat" },
    saison: { valeur: 40, label: "Printemps · Été" },
    tags: ["Lumineux", "Poudré", "Bureau"],
    note: 4.7,
    avis: 132,
    contenances: [
      { label: "30 ml", prix: 24500, stock: 25 },
      { label: "50 ml", prix: 38500, stock: 14 },
    ],
    visuel: { forme: "rond", verre: "#e6a3ac", bouchon: "#f3e8e3", fond: "#f2d0d7" },
  },
  {
    slug: "jasmin-celeste",
    nom: "Jasmin Céleste",
    univers: "parfums",
    type: "Eau de toilette",
    famille: "Floral",
    genre: "Femme",
    intensite: 2,
    occasions: ["Quotidien", "Bureau"],
    description: "Un floral blanc solaire : jasmin sambac, tubéreuse et une pointe d'agrumes pour la légèreté.",
    pyramide: { tete: ["Citron", "Néroli"], coeur: ["Jasmin sambac", "Tubéreuse"], fond: ["Musc", "Bois blonds"] },
    tenue: { valeur: 55, label: "5 h" },
    sillage: { valeur: 45, label: "Léger" },
    saison: { valeur: 30, label: "Printemps · Été" },
    tags: ["Solaire", "Floral blanc"],
    note: 4.6,
    avis: 58,
    contenances: [
      { label: "50 ml", prix: 29900, stock: 22 },
      { label: "100 ml", prix: 45000, stock: 10 },
    ],
    visuel: { forme: "carre", verre: "#efe2a8", bouchon: "#141414", fond: "#f3efd9" },
  },
  {
    slug: "vetiver-sahel",
    nom: "Vétiver Sahel",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Boisé",
    genre: "Homme",
    intensite: 3,
    occasions: ["Bureau", "Quotidien"],
    description: "Un boisé frais et minéral : vétiver, pamplemousse et cèdre, comme le vent sec du Sahel.",
    pyramide: { tete: ["Pamplemousse", "Gingembre"], coeur: ["Vétiver", "Lavande"], fond: ["Cèdre", "Mousse de chêne"] },
    tenue: { valeur: 70, label: "7 h" },
    sillage: { valeur: 55, label: "Modéré" },
    saison: { valeur: 45, label: "Toutes saisons" },
    tags: ["Frais", "Bureau", "Élégant"],
    note: 4.7,
    avis: 81,
    contenances: [
      { label: "50 ml", prix: 44000, stock: 15 },
      { label: "100 ml", prix: 69000, stock: 7 },
    ],
    visuel: { forme: "octogone", verre: "#6f8f5e", bouchon: "#141414", fond: "#dfe6d6" },
  },
  {
    slug: "rubis-intense",
    nom: "Rubis Intense",
    univers: "parfums",
    type: "Extrait de parfum",
    famille: "Fruité",
    genre: "Femme",
    intensite: 4,
    occasions: ["Soirée"],
    description: "Un fruité épicé envoûtant : cerise noire, baies rouges et poivre, sur un fond de patchouli.",
    pyramide: { tete: ["Cerise noire", "Baies rouges"], coeur: ["Rose", "Poivre"], fond: ["Patchouli", "Vanille"] },
    tenue: { valeur: 85, label: "9 h" },
    sillage: { valeur: 80, label: "Marqué" },
    saison: { valeur: 65, label: "Automne · Hiver" },
    tags: ["Soirée", "Envoûtant"],
    badge: "Best-seller",
    note: 4.8,
    avis: 143,
    contenances: [{ label: "50 ml", prix: 58000, stock: 11 }],
    visuel: { forme: "rond", verre: "#7a1f35", bouchon: "#f3e8e3", fond: "#f2d0d7" },
  },
  {
    slug: "brise-de-goree",
    nom: "Brise de Gorée",
    univers: "parfums",
    type: "Eau de toilette",
    famille: "Frais / Hespéridé",
    genre: "Mixte",
    intensite: 1,
    occasions: ["Quotidien", "Bureau"],
    description: "L'air iodé de l'île de Gorée : citron vert, sel marin et bois flotté.",
    pyramide: { tete: ["Citron vert", "Menthe"], coeur: ["Sel marin", "Thé vert"], fond: ["Bois flotté", "Ambrette"] },
    tenue: { valeur: 45, label: "4 h" },
    sillage: { valeur: 35, label: "Discret" },
    saison: { valeur: 20, label: "Été" },
    tags: ["Frais", "Iodé"],
    note: 4.5,
    avis: 39,
    contenances: [
      { label: "50 ml", prix: 26000, stock: 30 },
      { label: "100 ml", prix: 39000, stock: 16 },
    ],
    visuel: { forme: "fin", verre: "#9fc9cf", bouchon: "#ffffff", fond: "#e1eef0" },
  },
];

const huiles: Produit[] = [
  {
    slug: "huile-thiouraye",
    nom: "Huile Thiouraye",
    univers: "huiles",
    type: "Huile parfumée",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 4,
    occasions: ["Cérémonie", "Tabaski", "Soirée"],
    description: "Le thiouraye de la maison, en huile précieuse : encens, bois et résines, pour le corps et le linge.",
    pyramide: { tete: ["Clou de girofle"], coeur: ["Encens", "Gowé"], fond: ["Bois de santal", "Résines"] },
    tenue: { valeur: 90, label: "12 h" },
    sillage: { valeur: 70, label: "Marqué" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Tradition", "Encens"],
    badge: "Coup de cœur",
    note: 4.9,
    avis: 167,
    contenances: [{ label: "15 ml", prix: 15000, stock: 4 }],
    visuel: { forme: "fin", verre: "#d39a3a", bouchon: "#a8153a", fond: "#f3e7c9" },
  },
  {
    slug: "musc-soyeux",
    nom: "Musc Soyeux",
    univers: "huiles",
    type: "Huile parfumée",
    famille: "Musqué",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    description: "Un musc blanc propre et soyeux, comme une seconde peau.",
    pyramide: { tete: ["Aldéhydes"], coeur: ["Musc blanc", "Fleur de coton"], fond: ["Ambrette"] },
    tenue: { valeur: 70, label: "8 h" },
    sillage: { valeur: 40, label: "Intime" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: ["Propre", "Peau"],
    note: 4.7,
    avis: 88,
    contenances: [{ label: "15 ml", prix: 12500, stock: 26 }],
    visuel: { forme: "fin", verre: "#ece6df", bouchon: "#141414", fond: "#ece9e6" },
  },
];

const cosmetiques: Produit[] = [
  {
    slug: "creme-nuit-de-teranga",
    nom: "Crème Nuit de Téranga",
    univers: "cosmetiques",
    type: "Crème corps parfumée",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    description: "La signature Nuit de Téranga dans une crème fondante au beurre de karité.",
    pyramide: { tete: ["Bergamote"], coeur: ["Rose de Taïf"], fond: ["Oud", "Vanille"] },
    tenue: { valeur: 50, label: "5 h" },
    sillage: { valeur: 30, label: "Intime" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Karité", "Soin"],
    note: 4.8,
    avis: 47,
    contenances: [{ label: "200 ml", prix: 18500, stock: 14 }],
    visuel: { forme: "pot", verre: "#f4dcc2", bouchon: "#ffffff", fond: "#f1ddd0" },
  },
];

const maison: Produit[] = [
  {
    slug: "bougie-baobab",
    nom: "Bougie Baobab",
    univers: "maison",
    type: "Bougie parfumée",
    famille: "Boisé",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    description: "Cire végétale, notes de bois de baobab, cuir doux et vanille fumée. 45 heures de combustion.",
    pyramide: { tete: ["Bois sec"], coeur: ["Cuir doux"], fond: ["Vanille fumée"] },
    tenue: { valeur: 75, label: "45 h" },
    sillage: { valeur: 60, label: "Diffus" },
    saison: { valeur: 70, label: "Automne · Hiver" },
    tags: ["Cocooning"],
    note: 4.6,
    avis: 32,
    contenances: [{ label: "220 g", prix: 21000, stock: 7 }],
    visuel: { forme: "bougie", verre: "#f3ecd9", bouchon: "#f3ecd9", fond: "#e4e8dc" },
  },
  {
    slug: "diffuseur-teranga",
    nom: "Diffuseur Téranga",
    univers: "maison",
    type: "Diffuseur à bâtonnets",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    description: "Le parfum d'accueil de la maison SALMA, diffusé en continu pendant 3 mois.",
    pyramide: { tete: ["Bergamote"], coeur: ["Rose", "Encens"], fond: ["Ambre"] },
    tenue: { valeur: 90, label: "3 mois" },
    sillage: { valeur: 50, label: "Diffus" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: ["Accueil"],
    note: 4.7,
    avis: 29,
    contenances: [{ label: "200 ml", prix: 27500, stock: 12 }],
    visuel: { forme: "diffuseur", verre: "#8cc3c9", bouchon: "#6b4b33", fond: "#dfe9e4" },
  },
];

export const produits: Produit[] = [...parfums, ...huiles, ...cosmetiques, ...maison];

export const familles: Famille[] = ["Oriental", "Boisé", "Floral", "Ambré", "Frais / Hespéridé", "Fruité", "Musqué"];
export const genres: Genre[] = ["Femme", "Homme", "Mixte"];
export const occasions: Occasion[] = ["Soirée", "Bureau", "Cérémonie", "Quotidien", "Tabaski"];

export function getUnivers(slug: string) {
  return univers.find((u) => u.slug === slug);
}

export function getProduit(slug: string) {
  return produits.find((p) => p.slug === slug);
}

export function produitsDeUnivers(slug: UniversSlug) {
  return produits.filter((p) => p.univers === slug);
}

export function prixMin(p: Produit) {
  return Math.min(...p.contenances.map((c) => c.prix));
}

export function bestSellers() {
  return [...produits].sort((a, b) => b.avis - a.avis).slice(0, 4);
}

export function produitsAssocies(p: Produit) {
  return produits.filter((x) => x.slug !== p.slug && (x.famille === p.famille || x.univers === p.univers)).slice(0, 4);
}

export function formatFCFA(montant: number) {
  return new Intl.NumberFormat("fr-FR").format(montant).replace(/ | /g, " ");
}

export const LIVRAISON_OFFERTE_DES = 30000;
