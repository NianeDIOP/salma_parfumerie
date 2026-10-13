import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { ChoixTheme } from "./choix";

export default async function ThemeAdmin() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage icone="couleur" ton="violet" titre="Thème de l'admin" description="Choisissez l'apparence de l'espace de gestion · aperçu en direct avant de valider" />
      <ChoixTheme theme={reglages.admin.theme} perso={reglages.admin.perso} />
    </>
  );
}
