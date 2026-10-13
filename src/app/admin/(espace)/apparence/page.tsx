import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurApparence } from "./editeur";

export default async function Apparence() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage icone="apparence" ton="rouge" titre="Apparence" description="Identité, couleurs, police, en-tête, pied de page et barre mobile" />
      <EditeurApparence identite={reglages.identite} entete={reglages.entete} pied={reglages.pied} mobile={reglages.mobile} />
    </>
  );
}
