import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurPages } from "./editeur";

export default async function Pages() {
  const { reglages } = await lireBase();
  return (
    <>
      <EnTetePage titre="Pages" description="Pages de contenu : livraison, FAQ, contact, CGV… Elles sont accessibles à l'adresse /pages/nom-de-la-page." />
      <EditeurPages pages={reglages.pages} />
    </>
  );
}
