import Link from "next/link";
import { Icone } from "@/components/admin/icones";
import { BadgeStatut, dateCourte } from "@/components/admin/statut";
import { classeBouton, classeOnglet, classeSaisie } from "@/components/admin/styles";
import { EnTetePage } from "@/components/admin/ui";
import { formatFCFA } from "@/lib/catalogue";
import { lireBase } from "@/lib/db";
import { moyensPaiement, statuts } from "@/lib/site";

export default async function Commandes({ searchParams }: PageProps<"/admin/commandes">) {
  const sp = await searchParams;
  const statut = typeof sp.statut === "string" ? sp.statut : "";
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const { commandes } = await lireBase();
  const liste = commandes.filter(
    (c) => (!statut || c.statut === statut) && (!q || `${c.numero} ${c.client.nom} ${c.client.telephone}`.toLowerCase().includes(q)),
  );
  const compte = (id: string) => commandes.filter((c) => c.statut === id).length;

  return (
    <>
      <EnTetePage
        icone="commandes"
        ton="bleu"
        titre="Commandes"
        description="Site, boutique et WhatsApp · ouvrez une commande pour la faire avancer jusqu'à la livraison"
        actions={
          <Link href="/admin/commandes/nouvelle" className={classeBouton()}>
            <Icone nom="plus" /> Nouvelle vente
          </Link>
        }
      />

      <div className="no-scrollbar -mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Link href="/admin/commandes" className={classeOnglet(!statut)}>
          Toutes <span className="opacity-60">{commandes.length}</span>
        </Link>
        {statuts.map((s) => (
          <Link
            key={s.id}
            href={`/admin/commandes?statut=${s.id}`}
            className={classeOnglet(statut === s.id)}
          >
            <span className="size-1.5 rounded-full" style={{ background: s.couleur }} />
            {s.label} <span className="opacity-60">{compte(s.id)}</span>
          </Link>
        ))}
      </div>

      <form className="relative mb-3 md:max-w-sm">
        {statut && <input type="hidden" name="statut" value={statut} />}
        <Icone nom="recherche" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input name="q" defaultValue={q} placeholder="Numéro, nom, téléphone…" className={`${classeSaisie} pl-9`} />
      </form>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {liste.length === 0 ? (
          <p className="p-8 text-center text-xs text-muted">Aucune commande.</p>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="hidden border-b border-line bg-creme-light text-[11px] text-muted md:table-header-group">
              <tr>
                <th className="px-3 py-2 font-medium">Commande</th>
                <th className="px-3 py-2 font-medium">Client</th>
                <th className="px-3 py-2 font-medium">Canal</th>
                <th className="px-3 py-2 font-medium">Paiement</th>
                <th className="px-3 py-2 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {liste.map((c) => (
                <tr key={c.numero} className="relative block hover:bg-creme-light md:table-row">
                  <td className="block px-3 pt-2.5 md:table-cell md:py-2">
                    <Link href={`/admin/commandes/${c.numero}`} className="font-semibold after:absolute after:inset-0">
                      {c.numero}
                    </Link>
                    <span className="block text-[11px] text-muted">{dateCourte(c.date)}</span>
                  </td>
                  <td className="block px-3 md:table-cell md:py-2">
                    <span className="font-medium">{c.client.nom}</span>
                    <span className="block text-[11px] text-muted">{c.client.telephone}</span>
                  </td>
                  <td className="hidden px-3 py-2 capitalize md:table-cell">{c.canal}</td>
                  <td className="hidden px-3 py-2 md:table-cell">
                    {moyensPaiement.find((m) => m.id === c.paiement.moyen)?.label}
                    <span className={`block text-[11px] ${c.paiement.statut === "paye" ? "text-sauge" : "text-muted"}`}>
                      {c.paiement.statut === "paye" ? "Encaissé" : c.paiement.statut === "rembourse" ? "Remboursé" : "À encaisser"}
                    </span>
                  </td>
                  <td className="flex items-center justify-between px-3 pb-2.5 pt-1.5 md:table-cell md:py-2">
                    <BadgeStatut statut={c.statut} />
                    <span className="font-semibold tabular-nums md:hidden">{formatFCFA(c.total)} F</span>
                  </td>
                  <td className="hidden px-3 py-2 text-right font-semibold tabular-nums md:table-cell">{formatFCFA(c.total)} F</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
