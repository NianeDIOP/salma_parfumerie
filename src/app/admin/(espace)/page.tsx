import Link from "next/link";
import { Icone, PastilleIcone, type NomIcone, type Ton } from "@/components/admin/icones";
import { BadgeStatut, dateCourte } from "@/components/admin/statut";
import { classeBouton } from "@/components/admin/styles";
import { Carte, EnTetePage } from "@/components/admin/ui";
import { Photo } from "@/components/photo";
import { formatFCFA } from "@/lib/catalogue";
import { lireBase } from "@/lib/db";
import { moyensPaiement } from "@/lib/site";

const JOUR = 24 * 3600 * 1000;

// Heure de la requête (page rendue côté serveur à chaque visite)
function heureActuelle() {
  return Date.now();
}

export default async function TableauDeBord() {
  const base = await lireBase();
  const valides = base.commandes.filter((c) => !["annulee", "remboursee"].includes(c.statut));
  const maintenant = heureActuelle();
  const periode = (debut: number, fin: number) => valides.filter((c) => +new Date(c.date) >= debut && +new Date(c.date) < fin);
  const mois = periode(maintenant - 30 * JOUR, maintenant + JOUR);
  const moisPrec = periode(maintenant - 60 * JOUR, maintenant - 30 * JOUR);
  const ca = mois.reduce((n, c) => n + c.total, 0);
  const caPrec = moisPrec.reduce((n, c) => n + c.total, 0);
  const evolution = caPrec ? Math.round(((ca - caPrec) / caPrec) * 100) : null;
  const aujourdhui = periode(new Date().setHours(0, 0, 0, 0), maintenant + JOUR);
  const aTraiter = base.commandes.filter((c) => ["en_attente", "payee", "preparation"].includes(c.statut));

  // Ventes des 14 derniers jours
  const jours = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(maintenant - (13 - i) * JOUR);
    d.setHours(0, 0, 0, 0);
    const total = periode(+d, +d + JOUR).reduce((n, c) => n + c.total, 0);
    return { label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), total };
  });
  const max = Math.max(1, ...jours.map((j) => j.total));

  const parMoyen = moyensPaiement.map((m) => ({ ...m, total: mois.filter((c) => c.paiement.moyen === m.id).reduce((n, c) => n + c.total, 0) }));
  const totalMoyens = Math.max(1, parMoyen.reduce((n, m) => n + m.total, 0));

  const ventesProduit = new Map<string, { nom: string; image: string; quantite: number; total: number }>();
  for (const c of mois)
    for (const l of c.lignes) {
      const v = ventesProduit.get(l.slug) ?? { nom: `${l.marque} ${l.nom}`, image: l.image, quantite: 0, total: 0 };
      v.quantite += l.quantite;
      v.total += l.prix * l.quantite;
      ventesProduit.set(l.slug, v);
    }
  const top = [...ventesProduit.values()].sort((a, b) => b.total - a.total).slice(0, 5);
  const alertes = base.produits.flatMap((p) => p.contenances.filter((c) => c.stock <= (p.seuilAlerte ?? 5)).map((c) => ({ p, c }))).slice(0, 6);

  const kpis: { label: string; valeur: string; detail: string; icone: NomIcone; ton: Ton; tendance?: number | null }[] = [
    { label: "Chiffre d'affaires · 30 j", valeur: `${formatFCFA(ca)} F`, detail: evolution === null ? "Première période" : "vs 30 j précédents", icone: "argent", ton: "rouge", tendance: evolution },
    { label: "Commandes · 30 j", valeur: String(mois.length), detail: `${aujourdhui.length} aujourd'hui`, icone: "commandes", ton: "bleu" },
    { label: "Panier moyen", valeur: `${formatFCFA(mois.length ? Math.round(ca / mois.length) : 0)} F`, detail: "sur 30 jours", icone: "panier", ton: "violet" },
    { label: "À traiter", valeur: String(aTraiter.length), detail: "attente · payées · préparation", icone: "horloge", ton: "ambre" },
  ];

  return (
    <>
      <EnTetePage
        icone="tableau"
        titre="Tableau de bord"
        description={new Date(maintenant).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        actions={
          <>
            <Link href="/admin/produits/nouveau" className={classeBouton("secondaire")}>
              <Icone nom="produits" /> Produit
            </Link>
            <Link href="/admin/commandes/nouvelle" className={classeBouton()}>
              <Icone nom="plus" /> Nouvelle vente
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-line bg-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs text-muted">{k.label}</p>
              <PastilleIcone nom={k.icone} ton={k.ton} taille="sm" />
            </div>
            <p className="mt-1.5 text-lg font-bold tabular-nums leading-tight md:text-xl">{k.valeur}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
              {k.tendance !== undefined && k.tendance !== null && (
                <span className={`font-semibold ${k.tendance >= 0 ? "text-[#2f8f5b]" : "text-[#c0392b]"}`}>
                  {k.tendance >= 0 ? "▲" : "▼"} {Math.abs(k.tendance)} %
                </span>
              )}
              {k.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Carte titre="Ventes des 14 derniers jours" icone="tendance" actions={<span className="text-xs font-semibold tabular-nums">{formatFCFA(jours.reduce((n, j) => n + j.total, 0))} F</span>}>
          <div className="flex items-end gap-1">
            {jours.map((j) => (
              <div key={j.label} className="group flex flex-1 flex-col items-center gap-1.5">
                <div className="relative flex h-32 w-full items-end">
                  <div className="w-full rounded-sm bg-bissap/80 transition group-hover:bg-bissap" style={{ height: `${Math.max(3, (j.total / max) * 100)}%` }} />
                  <span className="pointer-events-none absolute -top-6 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                    {formatFCFA(j.total)} F
                  </span>
                </div>
                <span className="text-[9px] text-muted">{j.label.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </Carte>

        <Carte titre="Moyens de paiement · 30 j" icone="carte">
          <ul className="space-y-2.5">
            {parMoyen.map((m) => (
              <li key={m.id}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{m.label}</span>
                  <span className="tabular-nums text-muted">{Math.round((m.total / totalMoyens) * 100)} %</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-line">
                  <div className="h-full rounded-full" style={{ width: `${(m.total / totalMoyens) * 100}%`, background: m.couleur }} />
                </div>
              </li>
            ))}
          </ul>
        </Carte>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Carte
          titre="Dernières commandes"
          icone="commandes"
          actions={
            <Link href="/admin/commandes" className="text-xs font-semibold text-bissap hover:underline">
              Tout voir
            </Link>
          }
        >
          {base.commandes.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted">Aucune commande pour l&apos;instant.</p>
          ) : (
            <ul className="-mx-4 -mb-4 divide-y divide-line border-t border-line">
              {base.commandes.slice(0, 6).map((c) => (
                <li key={c.numero}>
                  <Link href={`/admin/commandes/${c.numero}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-creme-light">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-ink/5 text-[11px] font-bold">{c.client.nom.slice(0, 2).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{c.client.nom}</span>
                      <span className="text-[11px] text-muted">
                        {c.numero} · {dateCourte(c.date)}
                      </span>
                    </span>
                    <span className="hidden sm:block">
                      <BadgeStatut statut={c.statut} />
                    </span>
                    <span className="w-20 text-right text-[13px] font-semibold tabular-nums">{formatFCFA(c.total)} F</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Carte>

        <div className="space-y-3">
          <Carte
            titre="Alertes stock"
            icone="alerte"
            actions={
              <Link href="/admin/stocks" className="text-xs font-semibold text-bissap hover:underline">
                Gérer
              </Link>
            }
          >
            {alertes.length === 0 ? (
              <p className="text-xs text-muted">Tous les stocks sont au-dessus du seuil.</p>
            ) : (
              <ul className="space-y-1.5">
                {alertes.map(({ p, c }) => (
                  <li key={p.slug + c.label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate">
                      {p.nom} <span className="text-muted">· {c.label}</span>
                    </span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${c.stock === 0 ? "bg-[#c0392b] text-white" : "bg-[#d9a521]/15 text-[#a07a10]"}`}>
                      {c.stock === 0 ? "Rupture" : `${c.stock} restant${c.stock > 1 ? "s" : ""}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Carte>

          <Carte titre="Meilleures ventes · 30 j" icone="etoile">
            {top.length === 0 ? (
              <p className="text-xs text-muted">Pas encore de ventes.</p>
            ) : (
              <ul className="space-y-2">
                {top.map((t, i) => (
                  <li key={t.nom} className="flex items-center gap-2.5 text-xs">
                    <span className="w-3 text-muted">{i + 1}</span>
                    <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-line">
                      <Photo id={t.image} alt="" sizes="28px" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{t.nom}</span>
                    <span className="text-muted">×{t.quantite}</span>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
        </div>
      </div>
    </>
  );
}
