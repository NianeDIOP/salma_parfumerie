import Link from "next/link";
import { Icone } from "@/components/admin/icones";
import { classeBouton, classeSaisie } from "@/components/admin/styles";
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
        icone="clients"
        ton="vert"
        titre="Clients"
        description={`${parTel.size} client(s) · classés par montant dépensé`}
        actions={
          <a href={csv} download="clients-salma.csv" className={classeBouton("secondaire")}>
            <Icone nom="telecharger" /> Exporter CSV
          </a>
        }
      />
      <form className="relative mb-3 md:max-w-sm">
        <Icone nom="recherche" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input name="q" defaultValue={q} placeholder="Rechercher un client…" className={`${classeSaisie} pl-9`} />
      </form>
      {clients.length === 0 ? (
        <p className="rounded-xl border border-line bg-white p-8 text-center text-xs text-muted">Les clients apparaîtront ici après leurs premières commandes.</p>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {clients.map((c) => (
            <div key={c.telephone} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#2f8f5b]/10 text-[11px] font-bold text-[#2f8f5b]">{c.nom.slice(0, 2).toUpperCase()}</span>
                  <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{c.nom}</p>
                  <p className="truncate text-[11px] text-muted">{c.telephone}{c.adresse && ` · ${c.adresse}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold tabular-nums">{formatFCFA(c.total)} F</p>
                  <p className="text-[11px] text-muted">{c.commandes} commande(s)</p>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1">
                {c.numeros.slice(0, 6).map((n) => (
                  <Link key={n} href={`/admin/commandes/${n}`} className="rounded bg-creme px-1.5 py-0.5 text-[11px] font-medium hover:bg-line">
                    {n}
                  </Link>
                ))}
                <a href={`https://wa.me/${c.telephone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex h-6 items-center rounded-md bg-[#25d366] px-2 text-[11px] font-medium text-white">
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
