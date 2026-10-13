import { lireBase } from "@/lib/db";
import { EditeurProduit } from "../editeur";

export default async function NouveauProduit() {
  const base = await lireBase();
  return <EditeurProduit produit={null} univers={base.univers} marques={[...new Set(base.produits.map((x) => x.marque))]} />;
}
