"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Notification, useAction } from "@/components/admin/ui";
import { dupliquerProduit, majProduitRapide, supprimerProduit } from "@/lib/actions/admin";

export function ActionsListe({ slug, publie, lien }: { slug: string; publie: boolean; lien: string }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const { retour, lancer } = useAction();
  const item = "block w-full px-4 py-2.5 text-left text-sm hover:bg-creme";
  return (
    <div className="relative z-10 self-start">
      <button onClick={() => setOuvert(!ouvert)} className="grid size-9 place-items-center rounded-full text-xl hover:bg-line" aria-label="Actions">
        ⋯
      </button>
      {ouvert && (
        <>
          <div className="fixed inset-0" onClick={() => setOuvert(false)} />
          <div className="absolute right-0 top-10 w-48 overflow-hidden rounded-xl border border-line bg-white shadow-xl">
            <a href={lien} target="_blank" className={item}>
              Voir sur le site ↗
            </a>
            <button className={item} onClick={() => lancer(() => majProduitRapide(slug, { publie: !publie }))}>
              {publie ? "Passer en brouillon" : "Mettre en ligne"}
            </button>
            <button className={item} onClick={() => lancer(() => dupliquerProduit(slug), (r) => r.ok && "slug" in r && router.push(`/admin/produits/${r.slug}`))}>
              Dupliquer
            </button>
            <button className={`${item} text-bissap`} onClick={() => confirm("Supprimer ce produit ?") && lancer(() => supprimerProduit(slug))}>
              Supprimer
            </button>
          </div>
        </>
      )}
      <Notification retour={retour} />
    </div>
  );
}
