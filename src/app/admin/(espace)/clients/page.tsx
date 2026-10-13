import Link from "next/link";
import { EnTetePage } from "@/components/admin/ui";
import { formatFCFA } from "@/lib/catalogue";
import { lireBase } from "@/lib/db";

// Fichier client construit à partir des commandes (regroupées par numéro de téléphone)
export default async function Clients({ searchParams }: PageProps<"/admin/clients">) {
  const q = String((await searchParams).q ?? "").toLowerCase();
  const { commandes } = await lireBase();
  const parTel = new Map<string, { nom: string; telephone: string; adresse: string; commandes: number; total: number; derniere: string; numeros: string[] }>();
  for (const c of commandes) {
    if (c.statut === "annulee") continue;
    const cle = c.client.telephone.replace(/\D/g, "").slice(-9);
    const e = parTel.get(cle) ?? { nom: c.client.nom, telephone: c.client.telephone, adresse: c.client.adresse, commandes: 0, total: 0, derniere: c.date, numeros: [] };
    e.commandes++;
    e.total += c.statut === "remboursee" ? 0 : c.total;
    if (c.date > e.derniere) e.derniere = c.date;
    e.numeros.push(c.numero);
    parTel.set(cle, e);
  }
  const clients = [...parTel.values()].filter((c) => !q || `${c.nom} ${c.telephone}`.toLowerCase().includes(q)).sort((a, b) => b.total - a.total);
  const csv = "data:text/csv;charset=utf-8," + encodeURIComponent(["Nom;Téléphone;Adresse;Commandes;Total FCFA;Dernière commande", ...clients.map((c) => [c.nom, c.telephone, c.adresse, c.commandes, c.total, c.derniere.slice(0, 10)].join(";"))].join("\n"));

  return (
    <>
      <EnTetePage
        titre="Clients"
        description={`${parTel.size} client(s) · classés par montant dépensé`}
        actions={
          <a href={csv} download="clients-salma.csv" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-ink">
            Exporter (Excel / CSV)
          </a>
        }
      />
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Rechercher un client…" className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink md:max-w-md" />
      </form>
      {clients.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-10 text-center text-muted">Les clients apparaîtront ici après leurs premières commandes.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {clients.map((c) => (
            <div key={c.telephone} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{c.nom}</p>
                  <p className="text-sm text-muted">{c.telephone}</p>
                  {c.adresse && <p className="text-sm text-muted">{c.adresse}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums">{formatFCFA(c.total)} F</p>
                  <p className="text-sm text-muted">{c.commandes} commande(s)</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.numeros.slice(0, 6).map((n) => (
                  <Link key={n} href={`/admin/commandes/${n}`} className="rounded-full bg-creme px-2.5 py-1 text-xs font-semibold hover:bg-line">
                    {n}
                  </Link>
                ))}
                <a href={`https://wa.me/${c.telephone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="ml-auto rounded-full bg-[#25d366] px-3 py-1 text-xs font-semibold text-white">
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
