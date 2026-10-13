import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono, Playfair_Display, Schibsted_Grotesk } from "next/font/google";
import { MotionProviders } from "@/components/motion/providers";
import { lireBase } from "@/lib/db";
import type { Reglages } from "@/lib/site";
import "./globals.css";

// Toutes les pages lisent la base à chaque visite : une modification faite dans l'admin
// apparaît immédiatement sur le site.
export const dynamic = "force-dynamic";

const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], preload: false });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], preload: false });
const dmsans = DM_Sans({ variable: "--font-dmsans", subsets: ["latin"], preload: false });
const code = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"], preload: false });

export async function generateMetadata(): Promise<Metadata> {
  const { reglages } = await lireBase();
  return {
    title: { default: reglages.seo.titre, template: `%s · ${reglages.identite.nom}` },
    description: reglages.seo.description,
    appleWebApp: { capable: true, title: reglages.identite.logo, statusBarStyle: "default" },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { reglages } = await lireBase();
  return { themeColor: reglages.identite.couleurs.fond, viewportFit: "cover" };
}

// Les couleurs et la police choisies dans l'admin remplacent celles du design system
function styleTheme({ couleurs: c, police }: Reglages["identite"]) {
  return `:root{--color-bissap:${c.primaire};--color-bissap-dark:${c.primaireFonce};--color-nuit:${c.secondaire};--color-rose:${c.accent};--color-creme:${c.fond};--color-creme-light:${c.fondClair};--color-ink:${c.texte};--color-muted:${c.texteDoux};--color-line:${c.ligne};--font-sans:var(--font-${police}),ui-sans-serif,system-ui,sans-serif;--font-grotesk:var(--font-${police})}`;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { reglages } = await lireBase();
  return (
    <html lang="fr" className={`${schibsted.variable} ${bricolage.variable} ${playfair.variable} ${dmsans.variable} ${code.variable} antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: styleTheme(reglages.identite) }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <MotionProviders>{children}</MotionProviders>
      </body>
    </html>
  );
}
