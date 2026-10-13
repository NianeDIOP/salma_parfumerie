"use client";

import { createContext, useContext, useMemo } from "react";
import type { Produit } from "@/lib/catalogue";
import type { DonneesSite } from "@/lib/site";

interface Contexte extends DonneesSite {
  getProduit: (slug: string) => Produit | undefined;
}

const SiteContext = createContext<Contexte | null>(null);

// Met à disposition des composants du navigateur les produits, univers et réglages
// lus dans la base (et donc gérés depuis l'admin).
export function SiteProvider({ donnees, children }: { donnees: DonneesSite; children: React.ReactNode }) {
  const valeur = useMemo(() => {
    const index = new Map(donnees.produits.map((p) => [p.slug, p]));
    return { ...donnees, getProduit: (slug: string) => index.get(slug) };
  }, [donnees]);
  return <SiteContext.Provider value={valeur}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite doit être utilisé dans <SiteProvider>");
  return ctx;
}
