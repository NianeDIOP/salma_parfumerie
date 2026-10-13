import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurLivraison } from "./editeur";

export default async function Livraison() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage titre="Livraison & paiement" description="Zones, délais, frais de livraison et moyens de paiement proposés aux clients." />
      <EditeurLivraison livraison={reglages.livraison} paiements={reglages.paiements} boutique={reglages.boutique} />
    </>
  );
}
