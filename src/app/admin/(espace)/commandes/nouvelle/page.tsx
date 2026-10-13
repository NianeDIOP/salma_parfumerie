import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { NouvelleVente } from "./formulaire";

export default async function PageNouvelleVente() {
  const base = await lireBase();
  return (
    <>
      <EnTetePage icone="plus" ton="vert" titre="Nouvelle vente" description="Vente en boutique ou commande WhatsApp · stock et statistiques mis à jour" />
      <NouvelleVente produits={base.produits} zones={base.reglages.livraison.zones.filter((z) => z.actif)} />
    </>
  );
}
