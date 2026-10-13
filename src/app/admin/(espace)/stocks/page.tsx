import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { TableStocks } from "./table";

export default async function Stocks() {
  const base = await lireBase();
  return (
    <>
      <EnTetePage titre="Stocks & prix" description="Modifiez directement les prix et les quantités, puis enregistrez. Les lignes en jaune sont sous le seuil d'alerte." />
      <TableStocks produits={base.produits} univers={base.univers} />
    </>
  );
}
