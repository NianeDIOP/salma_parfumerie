import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurUnivers } from "./editeur";

export default async function PageUnivers() {
  const base = await lireBase();
  const compte = Object.fromEntries(base.univers.map((u) => [u.slug, base.produits.filter((p) => p.univers === u.slug).length]));
  return (
    <>
      <EnTetePage titre="Univers" description="Les grandes catégories du site (Parfums, Huiles…) : nom, texte, photo, couleur et ordre d'affichage." />
      <EditeurUnivers univers={base.univers} compte={compte} />
    </>
  );
}
