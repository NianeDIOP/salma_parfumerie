import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { NouvelleVente } from "./formulaire";

export default async function PageNouvelleVente() {
  const base = await lireBase();
  return (
    <>
      <EnTetePage titre="Nouvelle vente" description="Enregistrez une vente faite en boutique ou une commande reçue sur WhatsApp. Le stock et les statistiques sont mis à jour." />
      <NouvelleVente produits={base.produits} zones={base.reglages.livraison.zones.filter((z) => z.actif)} />
    </>
  );
}
