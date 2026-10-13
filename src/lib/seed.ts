// Contenu par défaut, utilisé pour créer la base au premier lancement.
import { ambiances, seedProduits, seedUnivers } from "./catalogue";
import type { Reglages } from "./site";

export const reglagesParDefaut: Reglages = {
  identite: {
    nom: "SALMA Fragrance",
    logo: "salma",
    sousTitre: "fragrance",
    slogan: "Maison de parfum à Dakar",
    couleurs: {
      primaire: "#a8153a",
      primaireFonce: "#87102e",
      secondaire: "#1f2a5c",
      accent: "#f2d0d7",
      fond: "#f1efea",
      fondClair: "#f8f7f3",
      texte: "#1a1a1a",
      texteDoux: "#6b6762",
      ligne: "#dcd8d1",
    },
    police: "schibsted",
    curseur: true,
    transitionPages: true,
  },
  contact: {
    whatsapp: "221775665335",
    telephone: "+221 77 566 53 35",
    email: "contact@salmafragrance.com",
    adresse: "Dakar, Sénégal",
    horaires: "Lundi au samedi, 9 h – 20 h",
  },
  entete: {
    liens: [
      { label: "Parfums", href: "/parfums" },
      { label: "Huiles parfumées", href: "/huiles" },
      { label: "Cosmétiques", href: "/cosmetiques" },
      { label: "Maison", href: "/maison" },
      { label: "Coffrets", href: "/coffrets" },
    ],
    bouton: { label: "Ma Signature", href: "/quiz", visible: true },
    afficherCompte: true,
    afficherFavoris: true,
  },
  mobile: { onglets: { accueil: "Accueil", boutique: "Boutique", signature: "Signature", favoris: "Favoris", panier: "Panier" } },
  pied: {
    description: "Maison de parfum à Dakar. Parfums, huiles parfumées, cosmétiques et senteurs d'intérieur.",
    colonnes: [
      {
        titre: "Boutique",
        liens: [
          { label: "Parfums", href: "/parfums" },
          { label: "Huiles parfumées", href: "/huiles" },
          { label: "Cosmétiques", href: "/cosmetiques" },
          { label: "Maison", href: "/maison" },
          { label: "Coffrets & cadeaux", href: "/coffrets" },
        ],
      },
      {
        titre: "Expériences",
        liens: [
          { label: "Quiz « Ma Signature »", href: "/quiz" },
          { label: "Favoris", href: "/favoris" },
          { label: "Boutique", href: "/boutique" },
        ],
      },
      {
        titre: "Service",
        liens: [
          { label: "Livraison & retours", href: "/pages/livraison" },
          { label: "FAQ", href: "/pages/faq" },
          { label: "Contact", href: "/pages/contact" },
          { label: "CGV", href: "/pages/cgv" },
        ],
      },
    ],
    paiements: ["Wave", "Orange Money", "Free Money", "Visa", "Mastercard", "À la livraison"],
    copyright: "© 2026 SALMA Fragrance, Dakar",
    newsletter: { visible: true, placeholder: "Votre numéro pour les nouveautés", bouton: "S'inscrire" },
    grandLogo: true,
  },
  accueil: [
    { id: "hero", type: "hero", visible: true, produits: ["coco-noir", "bleu-de-chanel", "coco-mademoiselle", "versace-eros"], duree: 6, boutonDecouvrir: "Découvrir" },
    { id: "pastilles", type: "pastilles", visible: true, afficherCoffrets: true },
    { id: "marques", type: "marques", visible: true, marques: ["Chanel", "Versace", "Yves Saint Laurent", "Giorgio Armani", "Prada", "Dolce & Gabbana", "Miu Miu", "Maison SALMA"] },
    {
      id: "manifeste",
      type: "manifeste",
      visible: true,
      titre: "Une maison de parfum, pas un simple catalogue.",
      texte:
        "Les plus grandes maisons de parfum et nos créations SALMA, réunies à Dakar. Chaque flacon est authentique, choisi avec soin, et livré avec un échantillon pour vous faire découvrir une nouvelle signature.",
      bouton: { label: "Explorer les parfums", href: "/parfums" },
    },
    { id: "univers", type: "univers", visible: true, titre: "Quatre", titreAccent: "univers." },
    {
      id: "best",
      type: "produits",
      visible: true,
      titre: "Les plus désirés",
      texte: "",
      mode: "meilleures-ventes",
      produits: [],
      univers: "parfums",
      marque: "",
      nombre: 8,
      lien: { label: "Tout voir", href: "/parfums" },
    },
    {
      id: "familles",
      type: "familles",
      visible: true,
      items: [
        { titre: "La légèreté d'un matin à Gorée.", texte: "Agrumes, notes marines et bois clairs : des parfums lumineux pour le quotidien et la saison chaude.", produit: "acqua-di-gio" },
        { titre: "Un bouquet qui vous ressemble.", texte: "Rose, jasmin et fleur d'oranger : des sillages féminins, élégants, pleins de lumière.", produit: "coco-mademoiselle" },
        { titre: "La magie des nuits de Dakar.", texte: "Oud, vanille, encens et ambre : des parfums intenses pour les soirées et les grandes cérémonies.", produit: "coco-noir" },
      ],
    },
    {
      id: "editorial",
      type: "editorial",
      visible: true,
      titre: "Quelle est votre signature ?",
      texte: "Six questions, soixante secondes, et trois fragrances choisies pour vous.",
      image: ambiances.collection,
      bouton: { label: "Commencer le quiz", href: "/quiz" },
    },
    {
      id: "maison",
      type: "produits",
      visible: true,
      titre: "Les senteurs de chez nous.",
      texte: "Thiouraye, musc, huiles précieuses et bougies : nos créations, inspirées des maisons sénégalaises.",
      mode: "marque",
      produits: [],
      univers: "",
      marque: "Maison SALMA",
      nombre: 4,
      lien: { label: "Voir tout", href: "/huiles" },
    },
    {
      id: "reassurance",
      type: "reassurance",
      visible: true,
      items: [
        { icone: "camion", titre: "24 h", texte: "Livraison à Dakar pour toute commande passée avant 15 h" },
        { icone: "telephone", titre: "1 clic", texte: "Paiement Wave, Orange Money, Free Money ou carte" },
        { icone: "bouclier", titre: "100 %", texte: "Produits authentiques, achetés auprès des distributeurs officiels" },
        { icone: "cadeau", titre: "Offert", texte: "Un échantillon au choix dans chaque commande" },
      ],
    },
  ],
  pages: [
    {
      slug: "livraison",
      titre: "Livraison & retours",
      publie: true,
      contenu:
        "## Délais\n\nDakar et banlieue : 24 h pour toute commande passée avant 15 h, express en 3 h en option. Régions (Thiès, Mbour, Saint-Louis, Touba…) : 48 à 72 h. Retrait en boutique : 2 h après paiement.\n\n## Frais\n\nLa livraison est offerte à Dakar dès 30 000 FCFA.\n\n## Retours\n\nLes produits scellés sont retournables sous 7 jours. Un produit endommagé à la livraison est remplacé sans frais.",
    },
    {
      slug: "faq",
      titre: "Questions fréquentes",
      publie: true,
      contenu:
        "## Vos parfums sont-ils authentiques ?\n\nOui. Tous nos parfums de marque proviennent des distributeurs officiels.\n\n## Comment payer ?\n\nWave, Orange Money, Free Money, carte bancaire ou paiement à la livraison.\n\n## Puis-je demander conseil ?\n\nBien sûr : nos conseillères vous répondent sur WhatsApp.",
    },
    { slug: "contact", titre: "Contact", publie: true, contenu: "Écrivez-nous sur WhatsApp ou appelez-nous au +221 77 566 53 35.\n\nBoutique : Dakar, Sénégal. Du lundi au samedi, de 9 h à 20 h." },
    { slug: "cgv", titre: "Conditions générales de vente", publie: true, contenu: "## Objet\n\nLes présentes conditions régissent les ventes réalisées sur le site SALMA Fragrance.\n\n## Prix\n\nLes prix sont indiqués en francs CFA, toutes taxes comprises." },
  ],
  livraison: {
    echantillonOffert: true,
    zones: [
      { id: "dakar", label: "Dakar & banlieue", delai: "24 h (avant 15 h)", frais: 2000, gratuiteDes: 30000, actif: true },
      { id: "express", label: "Dakar express", delai: "3 h", frais: 4000, gratuiteDes: null, actif: true },
      { id: "regions", label: "Thiès, Mbour, Saint-Louis, Touba…", delai: "48 à 72 h", frais: 3500, gratuiteDes: null, actif: true },
      { id: "boutique", label: "Retrait en boutique", delai: "2 h après paiement", frais: 0, gratuiteDes: null, actif: true },
    ],
  },
  paiements: { wave: true, om: true, free: true, carte: true, livraison: true },
  seo: {
    titre: "SALMA Fragrance · Maison de parfum à Dakar",
    description: "Parfums, huiles parfumées, cosmétiques et senteurs d'intérieur. Livraison 24 h à Dakar, paiement Wave, Orange Money, Free Money ou carte.",
  },
  boutique: {
    texteVide: "Laissez-vous guider par nos univers olfactifs.",
    messageConfirmation: "Un message WhatsApp de confirmation vous a été envoyé.",
    paiementEnPlusieursFois: true,
  },
  admin: { theme: "salma", perso: {} },
};

export const produitsParDefaut = seedProduits.map((p) => ({ ...p, publie: true, seuilAlerte: 5 }));
export const universParDefaut = seedUnivers;
