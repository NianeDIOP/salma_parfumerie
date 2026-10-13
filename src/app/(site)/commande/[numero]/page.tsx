import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { formatFCFA } from "@/lib/catalogue";
import { lireBase } from "@/lib/db";
import { moyensPaiement, statuts, type StatutCommande } from "@/lib/site";

export const metadata: Metadata = { title: "Suivi de commande", robots: { index: false } };

const parcours: { statut: StatutCommande; label: string; detail: string }[] = [
  { statut: "payee", label: "Paiement reçu", detail: "Votre commande est confirmée" },
  { statut: "preparation", label: "En préparation", detail: "Emballage signature SALMA" },
  { statut: "expediee", label: "En livraison", detail: "Le livreur est en route" },
  { statut: "livree", label: "Livrée", detail: "Merci pour votre confiance" },
];
const ordre: StatutCommande[] = ["en_attente", "payee", "preparation", "expediee", "livree"];

const petales = Array.from({ length: 30 }, (_, i) => ({ left: `${(i * 37) % 100}%`, delay: `${(i % 10) * 0.2}s`, duree: `${2.8 + (i % 5) * 0.5}s` }));

// Page de suivi : le client la garde (lien envoyé par SMS / WhatsApp) et voit l'avancement en temps réel.
export default async function SuiviCommande({ params }: PageProps<"/commande/[numero]">) {
  const { numero } = await params;
  const base = await lireBase();
  const c = base.commandes.find((x) => x.numero === numero);
  if (!c) notFound();
  const rang = ordre.indexOf(c.statut);
  const annulee = c.statut === "annulee" || c.statut === "remboursee";
  const moyen = moyensPaiement.find((m) => m.id === c.paiement.moyen)?.label ?? c.paiement.moyen;
  const statut = statuts.find((s) => s.id === c.statut)!;

  return (
    <section className="mx-auto max-w-2xl md:py-10">
      <div className="relative overflow-hidden bg-bissap px-6 py-14 text-center text-white md:rounded-3xl">
        {!annulee &&
          petales.map((p, i) => (
            <span key={i} className="absolute -top-4 h-3.5 w-2.5 rounded-full bg-rose" style={{ left: p.left, animation: `petale ${p.duree} ${p.delay} ease-in forwards` }} />
          ))}
        <span className="mx-auto grid size-16 animate-fade-up place-items-center rounded-full bg-white text-bissap">
          <CheckIcon className="size-8" />
        </span>
        <h1 className="mt-6 text-4xl font-extrabold">Merci {c.client.nom.split(" ")[0]} !</h1>
        <p className="mt-2 text-white/85">
          Commande {c.numero} · {formatFCFA(c.total)} FCFA · {moyen}
        </p>
        <span className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold" style={{ color: statut.couleur }}>
          {statut.label}
        </span>
      </div>

      {!annulee && (
        <ol className="space-y-6 px-6 py-10">
          {parcours.map((e) => {
            const fait = ordre.indexOf(e.statut) <= rang;
            const date = c.historique.find((h) => h.statut === e.statut)?.date;
            return (
              <li key={e.statut} className="flex gap-4">
                <span className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full ${fait ? "bg-ink text-white" : "border-2 border-line"}`}>
                  {fait && <CheckIcon className="size-3.5" />}
                </span>
                <div>
                  <p className={`text-lg font-semibold ${fait ? "" : "text-muted"}`}>{e.label}</p>
                  <p className="text-sm text-muted">
                    {date ? new Date(date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) + " · " : ""}
                    {e.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mx-4 rounded-2xl bg-creme-light p-5 md:mx-0">
        <h2 className="text-lg font-bold">Votre commande</h2>
        <ul className="mt-4 divide-y divide-line">
          {c.lignes.map((l) => (
            <li key={l.slug + l.contenance} className="flex items-center gap-4 py-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-line">
                <Photo id={l.image} alt="" sizes="56px" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">
                  {l.marque} {l.nom}
                </span>
                <span className="text-sm text-muted">
                  {l.contenance} × {l.quantite}
                </span>
              </span>
              <span className="tabular-nums">{formatFCFA(l.prix * l.quantite)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Livraison · {c.zone.label}</dt>
            <dd>{c.zone.frais ? formatFCFA(c.zone.frais) : "Offerte"}</dd>
          </div>
          {c.remise > 0 && (
            <div className="flex justify-between text-bissap">
              <dt>Code {c.code}</dt>
              <dd>− {formatFCFA(c.remise)}</dd>
            </div>
          )}
          <div className="flex justify-between pt-2 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatFCFA(c.total)} FCFA</dd>
          </div>
        </dl>
      </div>
      <p className="mx-4 mt-4 text-sm text-muted md:mx-0">{base.reglages.boutique.messageConfirmation}</p>
      <div className="px-6 py-8 text-center">
        <Link href="/" className="inline-block rounded-full bg-ink px-8 py-4 font-semibold text-white">
          Retour à la boutique
        </Link>
      </div>
      <style>{`@keyframes petale { to { transform: translateY(460px) rotate(300deg); opacity: 0; } }`}</style>
    </section>
  );
}
