import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurCodes } from "./editeur";

export default async function Promotions() {
  const { codes } = await lireBase();
  return (
    <>
      <EnTetePage titre="Codes promo" description="Créez des codes de réduction en pourcentage ou en montant fixe, avec un minimum d'achat." />
      <EditeurCodes codes={codes} />
    </>
  );
}
