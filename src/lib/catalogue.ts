// Catalogue de démonstration.
// Photos : Unsplash (licence libre, usage commercial autorisé). Prix et stocks indicatifs,
// à remplacer par les données réelles de SALMA via l'API e-commerce (phase back-office).

export type UniversSlug = "parfums" | "huiles" | "cosmetiques" | "maison";

export type Famille = "Oriental" | "Boisé" | "Floral" | "Ambré" | "Frais / Hespéridé" | "Fruité" | "Musqué";

export type Genre = "Femme" | "Homme" | "Mixte";

export type Occasion = "Soirée" | "Bureau" | "Cérémonie" | "Quotidien" | "Tabaski";

export interface Contenance {
  label: string;
  prix: number;
  stock: number;
}

// Couleur de fond adaptée à chaque produit : elle pilote les fonds, les transitions et le texte.
export interface Theme {
  bg: string;
  accent: string;
  /** true : fond sombre, texte clair */
  dark: boolean;
}

export interface Produit {
  slug: string;
  nom: string;
  marque: string;
  univers: UniversSlug;
  type: string;
  famille: Famille;
  genre: Genre;
  intensite: 1 | 2 | 3 | 4;
  occasions: Occasion[];
  accroche: string;
  description: string;
  pyramide: { tete: string[]; coeur: string[]; fond: string[] };
  tenue: { valeur: number; label: string };
  sillage: { valeur: number; label: string };
  saison: { valeur: number; label: string };
  tags: string[];
  badge?: "Best-seller" | "Nouveau" | "Édition limitée" | "Coup de cœur" | "Maison SALMA";
  note: number;
  avis: number;
  contenances: Contenance[];
  /** identifiants de photos Unsplash (images.unsplash.com/photo-…) */
  images: string[];
  theme: Theme;
}

export interface Univers {
  slug: UniversSlug;
  nom: string;
  accroche: string;
  description: string;
  image: string;
  theme: Theme;
}

export const univers: Univers[] = [
  {
    slug: "parfums",
    nom: "Parfums",
    accroche: "Les grandes maisons, choisies pour vous",
    description: "Eaux de parfum et extraits des plus grandes maisons, authentiques et garantis.",
    image: "1594035910387-fea47794261f",
    theme: { bg: "#a8153a", accent: "#f2d0d7", dark: true },
  },
  {
    slug: "huiles",
    nom: "Huiles parfumées",
    accroche: "Thiouraye, musc & huiles précieuses",
    description: "Huiles corps et cheveux, thiouraye et musc : les senteurs de chez nous, version précieuse.",
    image: "1612817288484-6f916006741a",
    theme: { bg: "#1f2a5c", accent: "#d39a3a", dark: true },
  },
  {
    slug: "cosmetiques",
    nom: "Cosmétiques",
    accroche: "Soins parfumés du corps",
    description: "Crèmes, laits et soins pour prolonger le sillage, du matin au soir.",
    image: "1619451334792-150fd785ee74",
    theme: { bg: "#c9693a", accent: "#fde4cf", dark: true },
  },
  {
    slug: "maison",
    nom: "Maison",
    accroche: "Bougies & parfums d'intérieur",
    description: "Bougies, sprays d'ambiance et senteurs pour parfumer chaque pièce.",
    image: "1602874801007-bd458bb1b8b6",
    theme: { bg: "#3d4a33", accent: "#e9d9b6", dark: true },
  },
];

const parfums: Produit[] = [
  {
    slug: "coco-noir",
    nom: "Coco Noir",
    marque: "Chanel",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Oriental",
    genre: "Femme",
    intensite: 4,
    occasions: ["Soirée", "Cérémonie"],
    accroche: "Le mystère d'un oriental nocturne",
    description:
      "Un oriental sombre et lumineux à la fois : la rose et le jasmin s'enveloppent de patchouli, de fève tonka et d'encens. Le parfum des grandes soirées.",
    pyramide: { tete: ["Pamplemousse", "Bergamote"], coeur: ["Rose", "Jasmin", "Géranium"], fond: ["Patchouli", "Fève tonka", "Encens", "Vanille"] },
    tenue: { valeur: 90, label: "10 h" },
    sillage: { valeur: 80, label: "Marqué" },
    saison: { valeur: 70, label: "Automne · Hiver" },
    tags: ["Soirée", "Mystérieux", "Élégant"],
    badge: "Best-seller",
    note: 4.9,
    avis: 218,
    contenances: [
      { label: "50 ml", prix: 89000, stock: 12 },
      { label: "100 ml", prix: 125000, stock: 6 },
    ],
    images: ["1594035910387-fea47794261f", "1585386959984-a4155224a1ad"],
    theme: { bg: "#8f1230", accent: "#f2c6cf", dark: true },
  },
  {
    slug: "bleu-de-chanel",
    nom: "Bleu de Chanel",
    marque: "Chanel",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Boisé",
    genre: "Homme",
    intensite: 3,
    occasions: ["Bureau", "Soirée", "Quotidien"],
    accroche: "La liberté d'un boisé aromatique",
    description:
      "Un boisé aromatique intemporel : la fraîcheur des agrumes s'ouvre sur le cèdre et le santal, portés par un fond ambré et sensuel.",
    pyramide: { tete: ["Pamplemousse", "Citron", "Menthe"], coeur: ["Gingembre", "Jasmin", "Noix de muscade"], fond: ["Cèdre", "Santal", "Encens", "Ambre"] },
    tenue: { valeur: 80, label: "8 h" },
    sillage: { valeur: 65, label: "Présent" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: ["Élégant", "Polyvalent", "Bureau"],
    badge: "Best-seller",
    note: 4.9,
    avis: 264,
    contenances: [
      { label: "50 ml", prix: 79000, stock: 18 },
      { label: "100 ml", prix: 112000, stock: 9 },
    ],
    images: ["1523293182086-7651a899d37f"],
    theme: { bg: "#0f2c63", accent: "#9cc3f2", dark: true },
  },
  {
    slug: "coco-mademoiselle",
    nom: "Coco Mademoiselle",
    marque: "Chanel",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Ambré",
    genre: "Femme",
    intensite: 3,
    occasions: ["Quotidien", "Bureau", "Soirée"],
    accroche: "L'audace pétillante d'un chypre moderne",
    description:
      "Une femme libre et audacieuse : l'orange et la bergamote pétillent sur un cœur de rose et de jasmin, avant un fond de patchouli et de vétiver.",
    pyramide: { tete: ["Orange", "Bergamote"], coeur: ["Rose de mai", "Jasmin", "Litchi"], fond: ["Patchouli", "Vétiver", "Vanille", "Musc blanc"] },
    tenue: { valeur: 85, label: "9 h" },
    sillage: { valeur: 70, label: "Présent" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: ["Pétillant", "Féminin", "Signature"],
    badge: "Coup de cœur",
    note: 4.8,
    avis: 187,
    contenances: [
      { label: "50 ml", prix: 86000, stock: 14 },
      { label: "100 ml", prix: 119000, stock: 7 },
    ],
    images: ["1592945403244-b3fbafd7f539", "1595425970377-c9703cf48b6d"],
    theme: { bg: "#f3d9d6", accent: "#b04a5a", dark: false },
  },
  {
    slug: "versace-eros",
    nom: "Eros",
    marque: "Versace",
    univers: "parfums",
    type: "Eau de toilette",
    famille: "Frais / Hespéridé",
    genre: "Homme",
    intensite: 4,
    occasions: ["Soirée", "Quotidien"],
    accroche: "La puissance d'un dieu grec",
    description:
      "Menthe glacée, pomme verte et zeste de citron s'ouvrent sur une fève tonka gourmande et un fond de vanille et de cèdre. Irrésistible.",
    pyramide: { tete: ["Menthe", "Pomme verte", "Citron"], coeur: ["Fève tonka", "Ambroxan", "Géranium"], fond: ["Vanille", "Cèdre", "Vétiver", "Mousse de chêne"] },
    tenue: { valeur: 80, label: "8 h" },
    sillage: { valeur: 85, label: "Puissant" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Séducteur", "Frais", "Intense"],
    badge: "Best-seller",
    note: 4.8,
    avis: 241,
    contenances: [
      { label: "50 ml", prix: 52000, stock: 20 },
      { label: "100 ml", prix: 74000, stock: 11 },
    ],
    images: ["1587017539504-67cfbddac569"],
    theme: { bg: "#0d4a4f", accent: "#7fd6cf", dark: true },
  },
  {
    slug: "chanel-n5",
    nom: "N°5",
    marque: "Chanel",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Floral",
    genre: "Femme",
    intensite: 3,
    occasions: ["Cérémonie", "Soirée"],
    accroche: "L'essence même de la féminité",
    description:
      "Le bouquet floral aldéhydé le plus célèbre au monde : rose de mai et jasmin, illuminés d'aldéhydes et adoucis de vanille et de santal.",
    pyramide: { tete: ["Aldéhydes", "Néroli", "Ylang-ylang"], coeur: ["Rose de mai", "Jasmin", "Iris"], fond: ["Santal", "Vanille", "Vétiver"] },
    tenue: { valeur: 85, label: "9 h" },
    sillage: { valeur: 70, label: "Présent" },
    saison: { valeur: 55, label: "Toutes saisons" },
    tags: ["Iconique", "Floral", "Cérémonie"],
    note: 4.9,
    avis: 156,
    contenances: [
      { label: "50 ml", prix: 95000, stock: 8 },
      { label: "100 ml", prix: 132000, stock: 5 },
    ],
    images: ["1541643600914-78b084683601"],
    theme: { bg: "#d5e2ec", accent: "#c7772c", dark: false },
  },
  {
    slug: "black-opium",
    nom: "Black Opium",
    marque: "Yves Saint Laurent",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Oriental",
    genre: "Femme",
    intensite: 4,
    occasions: ["Soirée"],
    accroche: "L'adrénaline du café noir",
    description:
      "Un oriental gourmand électrisant : café noir, fleur d'oranger et jasmin sur un fond de vanille, de patchouli et de cèdre.",
    pyramide: { tete: ["Poire", "Poivre rose", "Fleur d'oranger"], coeur: ["Café", "Jasmin", "Amande amère"], fond: ["Vanille", "Patchouli", "Cèdre"] },
    tenue: { valeur: 90, label: "10 h" },
    sillage: { valeur: 80, label: "Marqué" },
    saison: { valeur: 70, label: "Automne · Hiver" },
    tags: ["Gourmand", "Soirée", "Addictif"],
    badge: "Best-seller",
    note: 4.8,
    avis: 203,
    contenances: [
      { label: "50 ml", prix: 78000, stock: 10 },
      { label: "90 ml", prix: 105000, stock: 6 },
    ],
    images: ["1600612253971-422e7f7faeb6"],
    theme: { bg: "#18161d", accent: "#d9a6c8", dark: true },
  },
  {
    slug: "acqua-di-gio",
    nom: "Acqua di Giò",
    marque: "Giorgio Armani",
    univers: "parfums",
    type: "Eau de toilette",
    famille: "Frais / Hespéridé",
    genre: "Homme",
    intensite: 2,
    occasions: ["Quotidien", "Bureau"],
    accroche: "La fraîcheur de la Méditerranée",
    description: "Un aquatique lumineux et intemporel : notes marines, bergamote et romarin sur un fond de cèdre et de patchouli.",
    pyramide: { tete: ["Notes marines", "Bergamote", "Néroli"], coeur: ["Romarin", "Jasmin", "Persil"], fond: ["Cèdre", "Patchouli", "Musc blanc"] },
    tenue: { valeur: 60, label: "6 h" },
    sillage: { valeur: 50, label: "Modéré" },
    saison: { valeur: 25, label: "Printemps · Été" },
    tags: ["Frais", "Aquatique", "Quotidien"],
    note: 4.7,
    avis: 178,
    contenances: [
      { label: "50 ml", prix: 58000, stock: 16 },
      { label: "100 ml", prix: 79000, stock: 12 },
    ],
    images: ["1619994403073-2cec844b8e63"],
    theme: { bg: "#e4e7ea", accent: "#5a7184", dark: false },
  },
  {
    slug: "luna-rossa-black",
    nom: "Luna Rossa Black",
    marque: "Prada",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Ambré",
    genre: "Homme",
    intensite: 4,
    occasions: ["Soirée", "Cérémonie"],
    accroche: "La nuit, en version magnétique",
    description: "Un ambré boisé sombre et sensuel : bergamote et patchouli s'unissent à l'ambre, à la coumarine et au musc.",
    pyramide: { tete: ["Bergamote"], coeur: ["Patchouli", "Angélique"], fond: ["Ambre", "Coumarine", "Musc", "Bois de santal"] },
    tenue: { valeur: 85, label: "9 h" },
    sillage: { valeur: 75, label: "Marqué" },
    saison: { valeur: 70, label: "Automne · Hiver" },
    tags: ["Nuit", "Sensuel", "Intense"],
    badge: "Nouveau",
    note: 4.7,
    avis: 64,
    contenances: [
      { label: "50 ml", prix: 72000, stock: 3 },
      { label: "100 ml", prix: 98000, stock: 4 },
    ],
    images: ["1610461888750-10bfc601b874"],
    theme: { bg: "#0b0b0c", accent: "#bfa27a", dark: true },
  },
  {
    slug: "gabrielle",
    nom: "Gabrielle",
    marque: "Chanel",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Floral",
    genre: "Femme",
    intensite: 2,
    occasions: ["Quotidien", "Bureau"],
    accroche: "Un floral solaire et lumineux",
    description: "Un bouquet de fleurs blanches éclatantes : jasmin, ylang-ylang, fleur d'oranger et tubéreuse de Grasse.",
    pyramide: { tete: ["Mandarine", "Pamplemousse", "Cassis"], coeur: ["Jasmin", "Ylang-ylang", "Tubéreuse"], fond: ["Santal", "Musc", "Iris"] },
    tenue: { valeur: 70, label: "7 h" },
    sillage: { valeur: 55, label: "Modéré" },
    saison: { valeur: 35, label: "Printemps · Été" },
    tags: ["Solaire", "Floral blanc", "Lumineux"],
    note: 4.7,
    avis: 92,
    contenances: [
      { label: "50 ml", prix: 88000, stock: 9 },
      { label: "100 ml", prix: 121000, stock: 4 },
    ],
    images: ["1563170351-be82bc888aa4"],
    theme: { bg: "#dfe6d6", accent: "#5f7a4c", dark: false },
  },
  {
    slug: "the-one",
    nom: "The One",
    marque: "Dolce & Gabbana",
    univers: "parfums",
    type: "Eau de parfum",
    famille: "Oriental",
    genre: "Homme",
    intensite: 3,
    occasions: ["Soirée", "Bureau"],
    accroche: "L'élégance d'un oriental épicé",
    description: "Un oriental épicé chaleureux : pamplemousse et coriandre, cœur de cardamome et de gingembre, fond de tabac et d'ambre.",
    pyramide: { tete: ["Pamplemousse", "Coriandre", "Basilic"], coeur: ["Cardamome", "Gingembre", "Fleur d'oranger"], fond: ["Tabac", "Ambre", "Cèdre"] },
    tenue: { valeur: 80, label: "8 h" },
    sillage: { valeur: 65, label: "Présent" },
    saison: { valeur: 65, label: "Automne · Hiver" },
    tags: ["Chaleureux", "Élégant"],
    note: 4.7,
    avis: 88,
    contenances: [
      { label: "50 ml", prix: 64000, stock: 13 },
      { label: "100 ml", prix: 89000, stock: 8 },
    ],
    images: ["1616949755610-8c9bbc08f138"],
    theme: { bg: "#e6e1d8", accent: "#a5702b", dark: false },
  },
  {
    slug: "miu-miu-l-eau-rosee",
    nom: "L'Eau Rosée",
    marque: "Miu Miu",
    univers: "parfums",
    type: "Eau de toilette",
    famille: "Fruité",
    genre: "Femme",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "Une fraîcheur fruitée et poudrée",
    description: "Un floral fruité tendre et pétillant : cassis, lys de la vallée et un fond musqué et poudré.",
    pyramide: { tete: ["Cassis", "Notes vertes"], coeur: ["Lys de la vallée", "Rose"], fond: ["Musc", "Akigalawood"] },
    tenue: { valeur: 55, label: "5 h" },
    sillage: { valeur: 45, label: "Léger" },
    saison: { valeur: 30, label: "Printemps · Été" },
    tags: ["Frais", "Poudré", "Jeune"],
    badge: "Nouveau",
    note: 4.6,
    avis: 41,
    contenances: [{ label: "100 ml", prix: 69000, stock: 10 }],
    images: ["1557170334-a9632e77c6e4"],
    theme: { bg: "#3c3f4f", accent: "#f2b9c4", dark: true },
  },
];

const huiles: Produit[] = [
  {
    slug: "huile-thiouraye",
    nom: "Thiouraye Royal",
    marque: "Maison SALMA",
    univers: "huiles",
    type: "Huile parfumée",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 4,
    occasions: ["Cérémonie", "Tabaski", "Soirée"],
    accroche: "Le thiouraye de la maison, en huile précieuse",
    description: "Encens, gowé et résines : le parfum des maisons sénégalaises, en huile pour le corps et le linge.",
    pyramide: { tete: ["Clou de girofle"], coeur: ["Encens", "Gowé"], fond: ["Bois de santal", "Résines", "Musc"] },
    tenue: { valeur: 90, label: "12 h" },
    sillage: { valeur: 70, label: "Marqué" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Tradition", "Encens"],
    badge: "Maison SALMA",
    note: 4.9,
    avis: 167,
    contenances: [{ label: "15 ml", prix: 15000, stock: 4 }],
    images: ["1612817288484-6f916006741a"],
    theme: { bg: "#efe7da", accent: "#8a5a2b", dark: false },
  },
  {
    slug: "musc-soyeux",
    nom: "Musc Soyeux",
    marque: "Maison SALMA",
    univers: "huiles",
    type: "Huile parfumée",
    famille: "Musqué",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "Un musc blanc, comme une seconde peau",
    description: "Un musc blanc propre et soyeux, enrichi d'huile d'argan. Quelques gouttes suffisent.",
    pyramide: { tete: ["Aldéhydes"], coeur: ["Musc blanc", "Fleur de coton"], fond: ["Ambrette", "Santal"] },
    tenue: { valeur: 70, label: "8 h" },
    sillage: { valeur: 40, label: "Intime" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: ["Propre", "Peau"],
    badge: "Maison SALMA",
    note: 4.7,
    avis: 88,
    contenances: [{ label: "30 ml", prix: 12500, stock: 26 }],
    images: ["1608571423902-eed4a5ad8108"],
    theme: { bg: "#ece4d8", accent: "#8b5a2b", dark: false },
  },
  {
    slug: "elixir-precieux",
    nom: "Élixir Précieux",
    marque: "Maison SALMA",
    univers: "huiles",
    type: "Huile corps & cheveux",
    famille: "Ambré",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "Nourrir et parfumer en un geste",
    description: "Huiles de baobab et de karité, parfumées d'ambre et de vanille, pour une peau satinée et des cheveux brillants.",
    pyramide: { tete: ["Néroli"], coeur: ["Fleur de baobab"], fond: ["Ambre", "Vanille"] },
    tenue: { valeur: 60, label: "6 h" },
    sillage: { valeur: 35, label: "Intime" },
    saison: { valeur: 50, label: "Toutes saisons" },
    tags: ["Soin", "Baobab"],
    badge: "Maison SALMA",
    note: 4.8,
    avis: 52,
    contenances: [{ label: "100 ml", prix: 18000, stock: 15 }],
    images: ["1611930022073-b7a4ba5fcccd"],
    theme: { bg: "#d8d4ca", accent: "#2f4a3a", dark: false },
  },
];

const cosmetiques: Produit[] = [
  {
    slug: "creme-karite-teranga",
    nom: "Crème Téranga",
    marque: "Maison SALMA",
    univers: "cosmetiques",
    type: "Crème corps parfumée",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "La douceur du karité, le sillage en plus",
    description: "Une crème fondante au beurre de karité, parfumée de rose et d'oud, pour une peau nourrie toute la journée.",
    pyramide: { tete: ["Bergamote"], coeur: ["Rose de Taïf"], fond: ["Oud", "Vanille"] },
    tenue: { valeur: 50, label: "5 h" },
    sillage: { valeur: 30, label: "Intime" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Karité", "Soin"],
    badge: "Maison SALMA",
    note: 4.8,
    avis: 47,
    contenances: [{ label: "200 ml", prix: 18500, stock: 14 }],
    images: ["1619451334792-150fd785ee74"],
    theme: { bg: "#e9dfd3", accent: "#2e6f74", dark: false },
  },
  {
    slug: "lait-corps-soyeux",
    nom: "Lait Soyeux",
    marque: "Maison SALMA",
    univers: "cosmetiques",
    type: "Lait corps parfumé",
    famille: "Musqué",
    genre: "Mixte",
    intensite: 1,
    occasions: ["Quotidien"],
    accroche: "Léger, frais, délicatement musqué",
    description: "Un lait corps fluide à absorption rapide, au parfum de musc blanc et de fleur de coton.",
    pyramide: { tete: ["Notes vertes"], coeur: ["Fleur de coton"], fond: ["Musc blanc"] },
    tenue: { valeur: 40, label: "4 h" },
    sillage: { valeur: 25, label: "Intime" },
    saison: { valeur: 30, label: "Printemps · Été" },
    tags: ["Léger", "Frais"],
    badge: "Maison SALMA",
    note: 4.6,
    avis: 33,
    contenances: [{ label: "250 ml", prix: 14500, stock: 20 }],
    images: ["1620916566398-39f1143ab7be"],
    theme: { bg: "#efede8", accent: "#7a6f5f", dark: false },
  },
];

const maison: Produit[] = [
  {
    slug: "bougie-baobab",
    nom: "Bougie Baobab",
    marque: "Maison SALMA",
    univers: "maison",
    type: "Bougie parfumée",
    famille: "Boisé",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "45 heures de chaleur boisée",
    description: "Cire végétale, notes de bois de baobab, cuir doux et vanille fumée. 45 heures de combustion.",
    pyramide: { tete: ["Bois sec"], coeur: ["Cuir doux"], fond: ["Vanille fumée"] },
    tenue: { valeur: 75, label: "45 h" },
    sillage: { valeur: 60, label: "Diffus" },
    saison: { valeur: 70, label: "Automne · Hiver" },
    tags: ["Cocooning"],
    badge: "Maison SALMA",
    note: 4.6,
    avis: 32,
    contenances: [{ label: "220 g", prix: 21000, stock: 7 }],
    images: ["1602874801007-bd458bb1b8b6"],
    theme: { bg: "#2b2724", accent: "#f2c27b", dark: true },
  },
  {
    slug: "bougie-nuit-de-dakar",
    nom: "Nuit de Dakar",
    marque: "Maison SALMA",
    univers: "maison",
    type: "Bougie parfumée",
    famille: "Oriental",
    genre: "Mixte",
    intensite: 3,
    occasions: ["Soirée"],
    accroche: "Encens, ambre et fleur de bissap",
    description: "Une bougie orientale envoûtante, pour les soirées entre amis. Cire de soja, mèche en coton.",
    pyramide: { tete: ["Bissap"], coeur: ["Encens"], fond: ["Ambre", "Oud"] },
    tenue: { valeur: 75, label: "40 h" },
    sillage: { valeur: 70, label: "Diffus" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Soirée", "Encens"],
    badge: "Maison SALMA",
    note: 4.7,
    avis: 26,
    contenances: [{ label: "200 g", prix: 19500, stock: 11 }],
    images: ["1603006905003-be475563bc59"],
    theme: { bg: "#232120", accent: "#f2b46b", dark: true },
  },
  {
    slug: "bougie-ambre-dore",
    nom: "Ambre Doré",
    marque: "Maison SALMA",
    univers: "maison",
    type: "Bougie parfumée",
    famille: "Ambré",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "La douceur d'un ambre vanillé",
    description: "Ambre, vanille et bois de cèdre pour une atmosphère chaleureuse et apaisante.",
    pyramide: { tete: ["Orange douce"], coeur: ["Ambre"], fond: ["Vanille", "Cèdre"] },
    tenue: { valeur: 70, label: "35 h" },
    sillage: { valeur: 55, label: "Diffus" },
    saison: { valeur: 60, label: "Toutes saisons" },
    tags: ["Douceur"],
    badge: "Maison SALMA",
    note: 4.6,
    avis: 19,
    contenances: [{ label: "180 g", prix: 17500, stock: 9 }],
    images: ["1605651202774-7d573fd3f12d"],
    theme: { bg: "#d9d3c7", accent: "#8a5a2b", dark: false },
  },
  {
    slug: "spray-teranga",
    nom: "Brume Téranga",
    marque: "Maison SALMA",
    univers: "maison",
    type: "Spray d'ambiance",
    famille: "Frais / Hespéridé",
    genre: "Mixte",
    intensite: 2,
    occasions: ["Quotidien"],
    accroche: "Le parfum d'accueil de la maison",
    description: "Une brume d'intérieur aux agrumes, au thé vert et à la fleur d'oranger, pour accueillir vos invités.",
    pyramide: { tete: ["Citron vert", "Bergamote"], coeur: ["Thé vert", "Fleur d'oranger"], fond: ["Musc"] },
    tenue: { valeur: 40, label: "3 h" },
    sillage: { valeur: 60, label: "Diffus" },
    saison: { valeur: 30, label: "Toutes saisons" },
    tags: ["Accueil", "Frais"],
    badge: "Maison SALMA",
    note: 4.5,
    avis: 21,
    contenances: [{ label: "250 ml", prix: 13500, stock: 18 }],
    images: ["1528740561666-dc2479dc08ab"],
    theme: { bg: "#e4ddd2", accent: "#7a4a24", dark: false },
  },
];

export const produits: Produit[] = [...parfums, ...huiles, ...cosmetiques, ...maison];

// Visuels éditoriaux (ambiances)
export const ambiances = {
  collection: "1615634260167-c8cdede054de",
  lumiere: "1588405748880-12d1d2a59f75",
};

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
  return [...produits].sort((a, b) => b.avis - a.avis).slice(0, 8);
}

export function produitsAssocies(p: Produit) {
  return produits.filter((x) => x.slug !== p.slug && (x.famille === p.famille || x.univers === p.univers)).slice(0, 4);
}

export function formatFCFA(montant: number) {
  return new Intl.NumberFormat("fr-FR").format(montant).replace(/ | /g, " ");
}

export const LIVRAISON_OFFERTE_DES = 30000;
