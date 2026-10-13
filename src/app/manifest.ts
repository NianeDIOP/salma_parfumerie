import type { MetadataRoute } from "next";

// Rend le site installable sur l'écran d'accueil, comme une application.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SALMA Fragrance",
    short_name: "SALMA",
    description: "Maison de parfum à Dakar : parfums, huiles parfumées, cosmétiques et senteurs d'intérieur.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1efea",
    theme_color: "#f1efea",
    lang: "fr",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
