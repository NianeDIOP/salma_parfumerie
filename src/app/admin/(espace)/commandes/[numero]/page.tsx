import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeStatut } from "@/components/admin/statut";
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
  const moyen = moyensPaiement.find((m) => m.id === c.paiement.moyen)?.label;
  const whatsapp = c.client.telephone.replace(/\D/g, "");

  return (
    <>
      <Link href="/admin/commandes" className="text-sm font-semibold text-muted hover:text-ink">
        ← Commandes
      </Link>
      <div className="mb-6 mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{c.numero}</h1>
        <BadgeStatut statut={c.statut} />
        <span className="text-sm text-muted">
          {new Date(c.date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })} · {c.canal}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Articles</h2>
            <ul className="mt-3 divide-y divide-line">
              {c.lignes.map((l) => (
                <li key={l.slug + l.contenance} className="flex items-center gap-4 py-3">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-line">
                    <Photo id={l.image} alt="" sizes="56px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      {l.marque} {l.nom}
                    </span>
                    <span className="text-sm text-muted">
                      {l.contenance} · {formatFCFA(l.prix)} F × {l.quantite}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatFCFA(l.prix * l.quantite)} F</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
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
              <div className="flex justify-between pt-1 text-lg font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatFCFA(c.total)} FCFA</dd>
              </div>
            </dl>
            {(c.echantillon || c.message) && (
              <div className="mt-4 space-y-1 rounded-xl bg-creme-light p-3 text-sm">
                {c.echantillon && (
                  <p>
                    <strong>Échantillon :</strong> {base.produits.find((p) => p.slug === c.echantillon)?.nom ?? c.echantillon}
                  </p>
                )}
                {c.message && (
                  <p>
                    <strong>Message cadeau :</strong> « {c.message} »
                  </p>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Historique</h2>
            <ol className="mt-4 space-y-4">
              {[...c.historique].reverse().map((h, i) => {
                const s = statuts.find((x) => x.id === h.statut)!;
                return (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: s.couleur }} />
                    <div>
                      <p className="font-semibold">{s.label}</p>
                      <p className="text-sm text-muted">
                        {new Date(h.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                        {h.note && ` · ${h.note}`}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <div className="space-y-4">
          <ActionsCommande commande={c} />

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Client</h2>
            <p className="mt-3 font-semibold">{c.client.nom}</p>
            <p className="text-sm">{c.client.telephone}</p>
            {c.client.adresse && <p className="mt-2 text-sm">{c.client.adresse}</p>}
            {c.client.repere && <p className="text-sm text-muted">Repère : {c.client.repere}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${c.client.telephone}`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink">
                Appeler
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Bonjour ${c.client.nom.split(" ")[0]}, votre commande ${c.numero} est ${statuts.find((s) => s.id === c.statut)?.label.toLowerCase()}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white"
              >
                WhatsApp
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Paiement</h2>
            <p className="mt-3">{moyen}</p>
            <p className={`text-sm font-semibold ${c.paiement.statut === "paye" ? "text-sauge" : "text-[#a07a10]"}`}>
              {c.paiement.statut === "paye" ? "Encaissé" : c.paiement.statut === "rembourse" ? "Remboursé" : "À encaisser"}
            </p>
            {c.paiement.reference && <p className="text-sm text-muted">Réf. {c.paiement.reference}</p>}
          </section>
        </div>
      </div>
    </>
  );
}
