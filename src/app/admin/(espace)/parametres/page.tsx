import { EnTetePage } from "@/components/admin/ui";
import { adminConnecte } from "@/lib/auth";
import { lireBase } from "@/lib/db";
import { Parametres } from "./editeur";

export default async function PageParametres() {
  const base = await lireBase();
  const moi = await adminConnecte();
  return (
    <>
      <EnTetePage icone="parametres" ton="gris" titre="Paramètres" description="Coordonnées, référencement et accès à l'administration" />
      <Parametres contact={base.reglages.contact} seo={base.reglages.seo} admins={base.admins.map(({ email, nom }) => ({ email, nom }))} moi={moi?.email ?? ""} />
    </>
  );
}
