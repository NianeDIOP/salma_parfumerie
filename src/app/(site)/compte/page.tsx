import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Mon compte" };

export default function ComptePage() {
  return (
    <ComingSoon
      titre="Votre espace SALMA"
      texte="Connexion par téléphone et code SMS, historique de commandes, favoris, adresses et points du Cercle SALMA."
    />
  );
}
