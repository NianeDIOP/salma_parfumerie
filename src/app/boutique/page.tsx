import type { Metadata } from "next";
import Link from "next/link";
import { Catalogue } from "@/components/catalogue";
import { Photo } from "@/components/photo";
import { RechercheBouton } from "@/components/recherche-bouton";
import { produits, produitsDeUnivers, univers } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Boutique" };

export default function BoutiquePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-4 md:px-8 md:pt-12">
        <h1 className="hidden text-7xl font-extrabold tracking-tighter md:block">Boutique</h1>
        <RechercheBouton className="md:mt-8 md:max-w-xl" />
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {univers.map((u) => (
            <Link key={u.slug} href={`/${u.slug}`} className="relative h-36 overflow-hidden rounded-2xl text-white active:scale-[0.98] md:h-52" style={{ background: u.theme.bg }}>
              <Photo id={u.image} alt="" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${u.theme.bg} 15%, transparent 75%)` }} />
              <div className="absolute inset-x-3 bottom-3">
                <p className="text-lg font-bold leading-tight md:text-2xl">{u.nom}</p>
                <p className="text-sm text-white/80">{produitsDeUnivers(u.slug).length} produits</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Catalogue produits={produits} titre="Tous les produits" />
    </>
  );
}
