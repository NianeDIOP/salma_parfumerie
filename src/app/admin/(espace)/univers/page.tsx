import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurUnivers } from "./editeur";

export default async function PageUnivers() {
  const base = await lireBase();
  const compte = Object.fromEntries(base.univers.map((u) => [u.slug, base.produits.filter((p) => p.univers === u.slug).length]));
  return (
    <>
      <EnTetePage icone="univers" ton="violet" titre="Univers" description="Catégories du site : nom, texte, photo, couleurs et ordre" />
      <EditeurUnivers univers={base.univers} compte={compte} />
    </>
  );
}
