"use client";

import Link from "next/link";
import { useCart } from "@/components/cart";
import { HeartIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { getProduit, type Produit } from "@/lib/catalogue";

export function Favoris() {
  const { favoris } = useCart();
  const produits = favoris.map((s) => getProduit(s)).filter((p): p is Produit => Boolean(p));

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-12">
      <h1 className="hidden text-7xl font-extrabold tracking-tighter md:block">Favoris</h1>
      {produits.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-rose text-bissap">
            <HeartIcon className="size-9" />
          </span>
          <p className="mt-6 text-2xl font-bold">Aucun favori pour l&apos;instant</p>
          <p className="mt-2 max-w-xs text-muted">Touchez le cœur d&apos;un parfum pour le retrouver ici.</p>
          <Link href="/boutique" className="mt-8 rounded-full bg-ink px-8 py-4 font-semibold text-white">
            Parcourir la boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:gap-x-6 lg:grid-cols-4">
          {produits.map((p, i) => (
            <ProductCard key={p.slug} produit={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
