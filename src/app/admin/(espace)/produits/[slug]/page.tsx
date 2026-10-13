import { notFound } from "next/navigation";
import { lireBase } from "@/lib/db";
import { EditeurProduit } from "../editeur";

export default async function ModifierProduit({ params }: PageProps<"/admin/produits/[slug]">) {
  const { slug } = await params;
  const base = await lireBase();
  const p = base.produits.find((x) => x.slug === slug);
  if (!p) notFound();
  return <EditeurProduit produit={p} univers={base.univers} marques={[...new Set(base.produits.map((x) => x.marque))]} />;
}
