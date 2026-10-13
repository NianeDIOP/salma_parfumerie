import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurLivraison } from "./editeur";

export default async function Livraison() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage icone="livraison" ton="bleu" titre="Livraison & paiement" description="Zones, délais, frais et moyens de paiement proposés aux clients" />
      <EditeurLivraison livraison={reglages.livraison} paiements={reglages.paiements} boutique={reglages.boutique} />
    </>
  );
}
