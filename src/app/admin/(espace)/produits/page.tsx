import Link from "next/link";
import { Icone } from "@/components/admin/icones";
import { classeBouton, classeSaisie } from "@/components/admin/styles";
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
        icone="produits"
        ton="violet"
        titre="Produits"
        description={`${base.produits.length} produits · ${base.produits.filter((p) => p.publie !== false).length} en ligne`}
        actions={
          <Link href="/admin/produits/nouveau" className={classeBouton()}>
            <Icone nom="plus" /> Ajouter un produit
          </Link>
        }
      />
      <form className="mb-3 flex flex-wrap gap-2">
        <div className="relative min-w-0 flex-1 md:max-w-xs">
          <Icone nom="recherche" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="Rechercher un produit…" className={`${classeSaisie} pl-9`} />
        </div>
        <select name="univers" defaultValue={u} className={`${classeSaisie} w-auto`}>
          <option value="">Tous les univers</option>
          {base.univers.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.nom}
            </option>
          ))}
        </select>
        <button className={classeBouton("secondaire")}>
          <Icone nom="recherche" /> Filtrer
        </button>
      </form>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {liste.map((p) => {
          const stock = stockTotal(p);
          return (
            <div key={p.slug} className="group relative flex gap-3 rounded-xl border border-line bg-white p-2.5 transition hover:border-ink/40 hover:shadow-sm">
              <span className="relative h-[72px] w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: p.theme.bg }}>
                <Photo id={p.images[0] ?? ""} alt="" sizes="56px" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-bissap">{p.marque}</p>
                <Link href={`/admin/produits/${p.slug}`} className="block truncate text-[13px] font-semibold leading-tight after:absolute after:inset-0">
                  {p.nom}
                </Link>
                <p className="truncate text-[11px] text-muted">
                  {base.univers.find((x) => x.slug === p.univers)?.nom ?? p.univers} · dès {formatFCFA(prixMin(p))} F
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] font-semibold">
                  <span className={`rounded px-1.5 py-0.5 ${p.publie === false ? "bg-line text-muted" : "bg-sauge/15 text-sauge"}`}>{p.publie === false ? "Brouillon" : "En ligne"}</span>
                  <span className={`rounded px-1.5 py-0.5 ${stock === 0 ? "bg-bissap text-white" : stock <= (p.seuilAlerte ?? 5) ? "bg-[#d9a521]/15 text-[#a07a10]" : "bg-line/70"}`}>
                    {stock === 0 ? "Rupture" : `Stock ${stock}`}
                  </span>
                  {p.badge && <span className="rounded bg-rose px-1.5 py-0.5 text-bissap">{p.badge}</span>}
                </div>
              </div>
              <ActionsListe slug={p.slug} publie={p.publie !== false} lien={`/${p.univers}/${p.slug}`} />
            </div>
          );
        })}
      </div>
      {liste.length === 0 && <p className="py-12 text-center text-xs text-muted">Aucun produit.</p>}
    </>
  );
}
