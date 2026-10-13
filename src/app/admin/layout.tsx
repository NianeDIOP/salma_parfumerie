import type { Metadata } from "next";
import { themeEffectif, variablesTheme } from "@/lib/admin-themes";
import { lireBase } from "@/lib/db";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

// Le thème choisi (Réglages › Thème de l'admin) s'applique à tout l'espace d'administration
export default async function AdminRacine({ children }: LayoutProps<"/admin">) {
  const { reglages } = await lireBase();
  const theme = themeEffectif(reglages.admin.theme, reglages.admin.perso);
  return (
    <div id="theme-admin" className="min-h-screen bg-[var(--a-fond)] font-sans text-ink" style={variablesTheme(theme) as React.CSSProperties}>
      {children}
    </div>
  );
}
