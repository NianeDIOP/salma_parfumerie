import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurApparence } from "./editeur";

export default async function Apparence() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage titre="Apparence" description="Identité, couleurs, police, en-tête, pied de page et barre mobile. Les changements s'appliquent à tout le site dès l'enregistrement." />
      <EditeurApparence identite={reglages.identite} entete={reglages.entete} pied={reglages.pied} mobile={reglages.mobile} />
    </>
  );
}
