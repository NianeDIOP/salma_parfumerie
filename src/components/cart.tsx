"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduit } from "@/lib/catalogue";

export interface CartLine {
  slug: string;
  contenance: string;
  quantite: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  bump: number;
  setOpen: (open: boolean) => void;
  add: (slug: string, contenance: string, quantite?: number) => void;
  update: (slug: string, contenance: string, quantite: number) => void;
  remove: (slug: string, contenance: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "salma-panier";

export function prixLigne(line: CartLine) {
  const produit = getProduit(line.slug);
  const c = produit?.contenances.find((x) => x.label === line.contenance);
  return (c?.prix ?? 0) * line.quantite;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Sauvegarde du panier (exigence « sauvegarde du panier » du cahier des charges)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique au montage
      if (saved) setLines(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const add = useCallback((slug: string, contenance: string, quantite = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.contenance === contenance);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, quantite: l.quantite + quantite } : l));
      }
      return [...prev, { slug, contenance, quantite }];
    });
    setBump((b) => b + 1);
    setOpen(true);
  }, []);

  const update = useCallback((slug: string, contenance: string, quantite: number) => {
    setLines((prev) =>
      quantite <= 0
        ? prev.filter((l) => !(l.slug === slug && l.contenance === contenance))
        : prev.map((l) => (l.slug === slug && l.contenance === contenance ? { ...l, quantite } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, contenance: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.contenance === contenance)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      open,
      bump,
      setOpen,
      add,
      update,
      remove,
      clear,
      count: lines.reduce((n, l) => n + l.quantite, 0),
      total: lines.reduce((n, l) => n + prixLigne(l), 0),
    }),
    [lines, open, bump, add, update, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
