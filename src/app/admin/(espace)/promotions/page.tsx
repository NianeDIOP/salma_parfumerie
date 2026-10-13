import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurCodes } from "./editeur";

export default async function Promotions() {
  const { codes } = await lireBase();
  return (
    <>
      <EnTetePage icone="promo" ton="rouge" titre="Codes promo" description="Réductions en pourcentage ou en montant, avec minimum d'achat" />
      <EditeurCodes codes={codes} />
    </>
  );
}
