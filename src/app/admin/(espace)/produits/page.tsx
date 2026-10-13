import Link from "next/link";
import { EnTetePage } from "@/components/admin/ui";
import { Photo } from "@/components/photo";
import { formatFCFA, prixMin, stockTotal } from "@/lib/catalogue";
import { lireBase } from "@/lib/db";
import { ActionsListe } from "./actions-liste";

export default async function Produits({ searchParams }: PageProps<"/admin/produits">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.toLowerCase() : "";
  const u = typeof sp.univers === "string" ? sp.univers : "";
  const base = await lireBase();
  const liste = base.produits.filter((p) => (!u || p.univers === u) && (!q || `${p.marque} ${p.nom} ${p.famille}`.toLowerCase().includes(q)));

  return (
    <>
      <EnTetePage
        titre="Produits"
        description={`${base.produits.length} produits · ${base.produits.filter((p) => p.publie !== false).length} visibles sur le site`}
        actions={
          <Link href="/admin/produits/nouveau" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-bissap">
            + Ajouter un produit
          </Link>
        }
      />
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Rechercher un produit…" className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink md:max-w-sm" />
        <select name="univers" defaultValue={u} className="rounded-xl border border-line bg-white px-4 py-3">
          <option value="">Tous les univers</option>
          {base.univers.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.nom}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-ink px-5 font-semibold text-white">Filtrer</button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {liste.map((p) => {
          const stock = stockTotal(p);
          return (
            <div key={p.slug} className="group relative flex gap-4 rounded-2xl border border-line bg-white p-3 transition hover:border-ink">
              <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl" style={{ background: p.theme.bg }}>
                <Photo id={p.images[0] ?? ""} alt="" sizes="80px" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-bissap">{p.marque}</p>
                <Link href={`/admin/produits/${p.slug}`} className="block truncate text-lg font-bold leading-tight after:absolute after:inset-0">
                  {p.nom}
                </Link>
                <p className="text-sm text-muted">
                  {base.univers.find((x) => x.slug === p.univers)?.nom ?? p.univers} · dès {formatFCFA(prixMin(p))} F
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className={`rounded-full px-2 py-0.5 ${p.publie === false ? "bg-line text-muted" : "bg-sauge/15 text-sauge"}`}>{p.publie === false ? "Brouillon" : "En ligne"}</span>
                  <span className={`rounded-full px-2 py-0.5 ${stock === 0 ? "bg-bissap text-white" : stock <= (p.seuilAlerte ?? 5) ? "bg-[#d9a521]/15 text-[#a07a10]" : "bg-line/70"}`}>
                    {stock === 0 ? "Rupture" : `Stock ${stock}`}
                  </span>
                  {p.badge && <span className="rounded-full bg-rose px-2 py-0.5 text-bissap">{p.badge}</span>}
                </div>
              </div>
              <ActionsListe slug={p.slug} publie={p.publie !== false} lien={`/${p.univers}/${p.slug}`} />
            </div>
          );
        })}
      </div>
      {liste.length === 0 && <p className="py-16 text-center text-muted">Aucun produit.</p>}
    </>
  );
}
