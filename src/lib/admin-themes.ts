// Thèmes de l'espace d'administration (indépendants du site public).
// Chaque thème redéfinit les variables de couleur, d'arrondi et de police à l'intérieur
// de l'admin uniquement : tout l'admin change d'apparence sans toucher au site.

import type { Police } from "./site";

export type Arrondi = "carre" | "doux" | "arrondi";

export interface ThemeAdmin {
  id: string;
  nom: string;
  description: string;
  sombre: boolean;
  fond: string; // arrière-plan général
  surface: string; // cartes, champs
  surfaceAlt: string; // zones secondaires, survols
  texte: string;
  texteDoux: string;
  ligne: string;
  primaire: string; // accents, liens, badges
  bouton: string; // bouton principal
  boutonTexte: string;
  barre: string; // barre latérale
  barreTexte: string;
  barreActif: string;
  barreActifTexte: string;
  arrondi: Arrondi;
  police: Police | "systeme";
}

export const themesAdmin: ThemeAdmin[] = [
  {
    id: "salma",
    nom: "Salma Crème",
    description: "Clair et chaleureux, aux couleurs de la maison",
    sombre: false,
    fond: "#f6f5f2",
    surface: "#ffffff",
    surfaceAlt: "#f8f7f3",
    texte: "#1a1a1a",
    texteDoux: "#6b6762",
    ligne: "#e4e0d9",
    primaire: "#a8153a",
    bouton: "#1a1a1a",
    boutonTexte: "#ffffff",
    barre: "#ffffff",
    barreTexte: "#1a1a1a",
    barreActif: "#1a1a1a",
    barreActifTexte: "#ffffff",
    arrondi: "doux",
    police: "schibsted",
  },
  {
    id: "nuit",
    nom: "Nuit",
    description: "Mode sombre, repose les yeux le soir",
    sombre: true,
    fond: "#0f1115",
    surface: "#181b21",
    surfaceAlt: "#1f232b",
    texte: "#ececec",
    texteDoux: "#8b919c",
    ligne: "#2a2f38",
    primaire: "#ff5c84",
    bouton: "#ff5c84",
    boutonTexte: "#16090d",
    barre: "#12151a",
    barreTexte: "#c9ccd2",
    barreActif: "#ff5c84",
    barreActifTexte: "#16090d",
    arrondi: "doux",
    police: "schibsted",
  },
  {
    id: "ardoise",
    nom: "Ardoise",
    description: "Barre latérale bleu nuit, contenu clair et net",
    sombre: false,
    fond: "#f3f4f7",
    surface: "#ffffff",
    surfaceAlt: "#f7f8fb",
    texte: "#151821",
    texteDoux: "#666c7a",
    ligne: "#e1e4ea",
    primaire: "#3b6fd1",
    bouton: "#1f2a5c",
    boutonTexte: "#ffffff",
    barre: "#1f2a5c",
    barreTexte: "#c9d1ec",
    barreActif: "#ffffff",
    barreActifTexte: "#1f2a5c",
    arrondi: "doux",
    police: "dmsans",
  },
  {
    id: "bissap",
    nom: "Bissap",
    description: "Barre latérale rouge bissap, identité forte",
    sombre: false,
    fond: "#f8f4f2",
    surface: "#ffffff",
    surfaceAlt: "#fbf6f4",
    texte: "#2a1016",
    texteDoux: "#7d6366",
    ligne: "#eadcd9",
    primaire: "#a8153a",
    bouton: "#a8153a",
    boutonTexte: "#ffffff",
    barre: "#a8153a",
    barreTexte: "#f6d6de",
    barreActif: "#ffffff",
    barreActifTexte: "#a8153a",
    arrondi: "arrondi",
    police: "schibsted",
  },
  {
    id: "emeraude",
    nom: "Émeraude",
    description: "Vert profond et apaisant",
    sombre: false,
    fond: "#f2f6f4",
    surface: "#ffffff",
    surfaceAlt: "#f6faf8",
    texte: "#10241c",
    texteDoux: "#5f7169",
    ligne: "#dce7e2",
    primaire: "#0f7a5a",
    bouton: "#0f7a5a",
    boutonTexte: "#ffffff",
    barre: "#0c3b2e",
    barreTexte: "#b9d6cb",
    barreActif: "#2fd29b",
    barreActifTexte: "#0c3b2e",
    arrondi: "arrondi",
    police: "dmsans",
  },
  {
    id: "or",
    nom: "Luxe doré",
    description: "Noir et or, esprit maison de parfum",
    sombre: false,
    fond: "#f7f3ec",
    surface: "#fffdf9",
    surfaceAlt: "#faf6ef",
    texte: "#1b1712",
    texteDoux: "#7a6f60",
    ligne: "#e9e0d1",
    primaire: "#a8803f",
    bouton: "#1b1712",
    boutonTexte: "#f3dfb4",
    barre: "#14110d",
    barreTexte: "#cfc3ad",
    barreActif: "#c9a15d",
    barreActifTexte: "#14110d",
    arrondi: "carre",
    police: "playfair",
  },
  {
    id: "minimal",
    nom: "Minimal",
    description: "Blanc pur, angles droits, aucune distraction",
    sombre: false,
    fond: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#fafafa",
    texte: "#111111",
    texteDoux: "#707070",
    ligne: "#e6e6e6",
    primaire: "#111111",
    bouton: "#111111",
    boutonTexte: "#ffffff",
    barre: "#fafafa",
    barreTexte: "#333333",
    barreActif: "#111111",
    barreActifTexte: "#ffffff",
    arrondi: "carre",
    police: "systeme",
  },
  {
    id: "lavande",
    nom: "Lavande",
    description: "Doux et moderne, violet poudré",
    sombre: false,
    fond: "#f6f4fb",
    surface: "#ffffff",
    surfaceAlt: "#faf9fd",
    texte: "#1d1830",
    texteDoux: "#6c6684",
    ligne: "#e6e2f1",
    primaire: "#7c5cd6",
    bouton: "#7c5cd6",
    boutonTexte: "#ffffff",
    barre: "#ffffff",
    barreTexte: "#3d3655",
    barreActif: "#efeafc",
    barreActifTexte: "#5b3fc0",
    arrondi: "arrondi",
    police: "bricolage",
  },
];

export const arrondis: { id: Arrondi; nom: string }[] = [
  { id: "carre", nom: "Carrés" },
  { id: "doux", nom: "Doux" },
  { id: "arrondi", nom: "Arrondis" },
];

export function themeEffectif(id: string, perso: Partial<ThemeAdmin> = {}): ThemeAdmin {
  const base = themesAdmin.find((t) => t.id === id) ?? themesAdmin[0];
  return { ...base, ...perso, id: base.id, nom: base.nom, description: base.description };
}

const RAYONS: Record<Arrondi, [string, string, string, string]> = {
  carre: ["2px", "3px", "4px", "5px"],
  doux: ["4px", "6px", "8px", "12px"],
  arrondi: ["6px", "10px", "14px", "20px"],
};

// Variables CSS appliquées au conteneur de l'admin (les classes Tailwind lisent ces variables)
export function variablesTheme(t: ThemeAdmin): Record<string, string> {
  const [sm, md, lg, xl] = RAYONS[t.arrondi];
  return {
    "--color-white": t.surface,
    "--color-ink": t.texte,
    "--color-muted": t.texteDoux,
    "--color-line": t.ligne,
    "--color-creme": t.surfaceAlt,
    "--color-creme-light": t.surfaceAlt,
    "--color-bissap": t.primaire,
    "--radius-sm": sm,
    "--radius-md": md,
    "--radius-lg": lg,
    "--radius-xl": xl,
    "--a-fond": t.fond,
    "--a-bouton": t.bouton,
    "--a-bouton-texte": t.boutonTexte,
    "--a-barre": t.barre,
    "--a-barre-texte": t.barreTexte,
    "--a-barre-actif": t.barreActif,
    "--a-barre-actif-texte": t.barreActifTexte,
    "--font-sans": t.police === "systeme" ? "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" : `var(--font-${t.police}), ui-sans-serif, system-ui, sans-serif`,
    "color-scheme": t.sombre ? "dark" : "light",
  };
}
