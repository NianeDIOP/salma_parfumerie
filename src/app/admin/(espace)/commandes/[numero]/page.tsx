import Link from "next/link";
import { notFound } from "next/navigation";
import { Icone } from "@/components/admin/icones";
import { BadgeStatut } from "@/components/admin/statut";
import { classeBouton } from "@/components/admin/styles";
import { Carte } from "@/components/admin/ui";
import { Photo } from "@/components/photo";
import { formatFCFA } from "@/lib/catalogue";
import { lireBase } from "@/lib/db";
import { moyensPaiement, statuts } from "@/lib/site";
import { ActionsCommande } from "./actions";

export default async function DetailCommande({ params }: PageProps<"/admin/commandes/[numero]">) {
  const { numero } = await params;
  const base = await lireBase();
  const c = base.commandes.find((x) => x.numero === numero);
  if (!c) notFound();
  const moyen = moyensPaiement.find((m) => m.id === c.paiement.moyen);
  const whatsapp = c.client.telephone.replace(/\D/g, "");
  const etat = c.paiement.statut === "paye" ? { t: "Encaissé", c: "text-[#2f8f5b]" } : c.paiement.statut === "rembourse" ? { t: "Remboursé", c: "text-[#c0392b]" } : { t: "À encaisser", c: "text-[#a07a10]" };

  return (
    <>
      <Link href="/admin/commandes" className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink">
        <Icone nom="retour" className="size-3.5" /> Commandes
      </Link>
      <div className="mb-4 mt-2 flex flex-wrap items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-[#3b6fd1]/10 text-[#3b6fd1]">
          <Icone nom="commandes" className="size-[18px]" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold md:text-xl">{c.numero}</h1>
            <BadgeStatut statut={c.statut} />
          </div>
          <p className="text-xs text-muted">
            {new Date(c.date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })} · {c.canal === "site" ? "Site" : c.canal === "boutique" ? "Boutique" : "WhatsApp"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          <Carte titre={`Articles · ${c.lignes.reduce((n, l) => n + l.quantite, 0)}`} icone="produits">
            <ul className="-mx-4 divide-y divide-line border-y border-line">
              {c.lignes.map((l) => (
                <li key={l.slug + l.contenance} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-line">
                    <Photo id={l.image} alt="" sizes="40px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {l.marque} {l.nom}
                    </span>
                    <span className="text-[11px] text-muted">
                      {l.contenance} · {formatFCFA(l.prix)} F × {l.quantite}
                    </span>
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums">{formatFCFA(l.prix * l.quantite)} F</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted">Sous-total</dt>
                <dd className="tabular-nums">{formatFCFA(c.sousTotal)} F</dd>
              </div>
              {c.remise > 0 && (
                <div className="flex justify-between text-bissap">
                  <dt>Remise {c.code ?? ""}</dt>
                  <dd className="tabular-nums">− {formatFCFA(c.remise)} F</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Livraison · {c.zone.label}</dt>
                <dd className="tabular-nums">{c.zone.frais ? `${formatFCFA(c.zone.frais)} F` : "Offerte"}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-sm font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatFCFA(c.total)} FCFA</dd>
              </div>
            </dl>
            {(c.echantillon || c.message) && (
              <div className="mt-3 space-y-0.5 rounded-lg bg-creme-light p-2.5 text-xs">
                {c.echantillon && (
                  <p>
                    <span className="text-muted">Échantillon :</span> {base.produits.find((p) => p.slug === c.echantillon)?.nom ?? c.echantillon}
                  </p>
                )}
                {c.message && (
                  <p>
                    <span className="text-muted">Message cadeau :</span> « {c.message} »
                  </p>
                )}
              </div>
            )}
          </Carte>

          <Carte titre="Historique" icone="historique">
            <ol className="relative space-y-3 border-l border-line pl-4">
              {[...c.historique].reverse().map((h, i) => {
                const s = statuts.find((x) => x.id === h.statut)!;
                return (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 size-2.5 rounded-full ring-2 ring-white" style={{ background: s.couleur }} />
                    <p className="text-[13px] font-medium">{s.label}</p>
                    <p className="text-[11px] text-muted">
                      {new Date(h.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                      {h.note && ` · ${h.note}`}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Carte>
        </div>

        <div className="space-y-3">
          <ActionsCommande commande={c} />

          <Carte titre="Client" icone="utilisateur">
            <p className="text-[13px] font-semibold">{c.client.nom}</p>
            <p className="text-xs text-muted">{c.client.telephone}</p>
            {c.client.adresse && <p className="mt-1.5 text-xs">{c.client.adresse}</p>}
            {c.client.repere && <p className="text-xs text-muted">Repère : {c.client.repere}</p>}
            <div className="mt-3 flex gap-2">
              <a href={`tel:${c.client.telephone}`} className={`${classeBouton("secondaire")} h-8 flex-1 text-xs`}>
                <Icone nom="telephone" className="size-3.5" /> Appeler
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Bonjour ${c.client.nom.split(" ")[0]}, votre commande ${c.numero} est ${statuts.find((s) => s.id === c.statut)?.label.toLowerCase()}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25d366] text-xs font-medium text-white hover:bg-[#1fb857]"
              >
                <Icone nom="message" className="size-3.5" /> WhatsApp
              </a>
            </div>
          </Carte>

          <Carte titre="Paiement" icone="carte">
            <div className="flex items-center gap-2.5">
              {moyen && (
                <span className="grid size-8 place-items-center rounded-md text-[10px] font-bold text-white" style={{ background: moyen.couleur }}>
                  {moyen.sigle}
                </span>
              )}
              <div>
                <p className="text-[13px] font-medium">{moyen?.label}</p>
                <p className={`text-xs font-semibold ${etat.c}`}>{etat.t}</p>
              </div>
            </div>
            {c.paiement.reference && <p className="mt-2 text-[11px] text-muted">Réf. {c.paiement.reference}</p>}
          </Carte>
        </div>
      </div>
    </>
  );
}
