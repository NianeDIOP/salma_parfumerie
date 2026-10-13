import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurPages } from "./editeur";

export default async function Pages() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage icone="pages" ton="gris" titre="Pages" description="Livraison, FAQ, contact, CGV… accessibles à l'adresse /pages/…" />
      <EditeurPages pages={reglages.pages} />
    </>
  );
}
