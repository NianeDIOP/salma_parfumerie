import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { TableStocks } from "./table";

export default async function Stocks() {
  const base = await lireBase();
  return (
    <>
      <EnTetePage icone="stocks" ton="ambre" titre="Stocks & prix" description="Modifiez prix et quantités directement · en jaune : sous le seuil d'alerte" />
      <TableStocks produits={base.produits} univers={base.univers} />
    </>
  );
}
