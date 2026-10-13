import Link from "next/link";
import { BadgeStatut, dateCourte } from "@/components/admin/statut";
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
        titre="Commandes"
        description="Toutes les ventes : site, boutique et WhatsApp. Cliquez sur une commande pour la faire avancer jusqu'à la livraison."
        actions={
          <Link href="/admin/commandes/nouvelle" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-bissap">
            + Nouvelle vente
          </Link>
        }
      />

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Link href="/admin/commandes" className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${!statut ? "bg-ink text-white" : "border border-line bg-white"}`}>
          Toutes · {commandes.length}
        </Link>
        {statuts.map((s) => (
          <Link
            key={s.id}
            href={`/admin/commandes?statut=${s.id}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${statut === s.id ? "bg-ink text-white" : "border border-line bg-white"}`}
          >
            {s.label} · {compte(s.id)}
          </Link>
        ))}
      </div>

      <form className="mb-4">
        {statut && <input type="hidden" name="statut" value={statut} />}
        <input name="q" defaultValue={q} placeholder="Rechercher : numéro, nom, téléphone…" className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink md:max-w-md" />
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {liste.length === 0 ? (
          <p className="p-10 text-center text-muted">Aucune commande.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="hidden border-b border-line bg-creme-light text-muted md:table-header-group">
              <tr>
                <th className="px-4 py-3 font-semibold">Commande</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Canal</th>
                <th className="px-4 py-3 font-semibold">Paiement</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {liste.map((c) => (
                <tr key={c.numero} className="relative block hover:bg-creme-light md:table-row">
                  <td className="block px-4 pt-3 md:table-cell md:py-3">
                    <Link href={`/admin/commandes/${c.numero}`} className="font-semibold after:absolute after:inset-0">
                      {c.numero}
                    </Link>
                    <span className="block text-xs text-muted">{dateCourte(c.date)}</span>
                  </td>
                  <td className="block px-4 md:table-cell md:py-3">
                    <span className="font-medium">{c.client.nom}</span>
                    <span className="block text-xs text-muted">{c.client.telephone}</span>
                  </td>
                  <td className="hidden px-4 py-3 capitalize md:table-cell">{c.canal}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {moyensPaiement.find((m) => m.id === c.paiement.moyen)?.label}
                    <span className={`block text-xs ${c.paiement.statut === "paye" ? "text-sauge" : "text-muted"}`}>
                      {c.paiement.statut === "paye" ? "Encaissé" : c.paiement.statut === "rembourse" ? "Remboursé" : "À encaisser"}
                    </span>
                  </td>
                  <td className="flex items-center justify-between px-4 pb-3 pt-2 md:table-cell md:py-3">
                    <BadgeStatut statut={c.statut} />
                    <span className="font-semibold tabular-nums md:hidden">{formatFCFA(c.total)} F</span>
                  </td>
                  <td className="hidden px-4 py-3 text-right font-semibold tabular-nums md:table-cell">{formatFCFA(c.total)} F</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
