import Link from "next/link";
import { BadgeStatut, dateCourte } from "@/components/admin/statut";
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

  const kpis = [
    { label: "Chiffre d'affaires (30 j)", valeur: `${formatFCFA(ca)} F`, detail: evolution === null ? "Première période" : `${evolution >= 0 ? "▲" : "▼"} ${Math.abs(evolution)} % vs 30 j précédents`, fort: true },
    { label: "Commandes (30 j)", valeur: String(mois.length), detail: `${aujourdhui.length} aujourd'hui` },
    { label: "Panier moyen", valeur: `${formatFCFA(mois.length ? Math.round(ca / mois.length) : 0)} F`, detail: "sur 30 jours" },
    { label: "À traiter", valeur: String(aTraiter.length), detail: "en attente, payées, en préparation" },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Bonjour 👋</h1>
          <p className="mt-1 text-muted">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/commandes/nouvelle" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-bissap">
            + Nouvelle vente
          </Link>
          <Link href="/admin/produits/nouveau" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-ink">
            + Produit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-2xl p-5 ${k.fort ? "bg-bissap text-white" : "border border-line bg-white"}`}>
            <p className={`text-sm ${k.fort ? "text-white/80" : "text-muted"}`}>{k.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight tabular-nums md:text-3xl">{k.valeur}</p>
            <p className={`mt-1 text-xs ${k.fort ? "text-white/80" : "text-muted"}`}>{k.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-bold">Ventes des 14 derniers jours</h2>
          <div className="mt-6 flex h-48 items-end gap-1.5">
            {jours.map((j) => (
              <div key={j.label} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-md bg-bissap/85 transition group-hover:bg-bissap" style={{ height: `${Math.max(2, (j.total / max) * 100)}%` }} />
                  <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white group-hover:block">
                    {formatFCFA(j.total)} F
                  </span>
                </div>
                <span className="text-[10px] text-muted">{j.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-bold">Moyens de paiement (30 j)</h2>
          <ul className="mt-5 space-y-3">
            {parMoyen.map((m) => (
              <li key={m.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.label}</span>
                  <span className="tabular-nums text-muted">{Math.round((m.total / totalMoyens) * 100)} %</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-line">
                  <div className="h-full rounded-full" style={{ width: `${(m.total / totalMoyens) * 100}%`, background: m.couleur }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-sm font-semibold text-bissap">
              Tout voir →
            </Link>
          </div>
          {base.commandes.length === 0 ? (
            <p className="py-10 text-center text-muted">Aucune commande pour l&apos;instant. Elles apparaîtront ici dès le premier achat.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {base.commandes.slice(0, 7).map((c) => (
                <li key={c.numero}>
                  <Link href={`/admin/commandes/${c.numero}`} className="flex items-center gap-3 py-3 hover:bg-creme-light">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{c.client.nom}</span>
                      <span className="text-sm text-muted">
                        {c.numero} · {dateCourte(c.date)}
                      </span>
                    </span>
                    <span className="hidden sm:block">
                      <BadgeStatut statut={c.statut} />
                    </span>
                    <span className="w-24 text-right font-semibold tabular-nums">{formatFCFA(c.total)} F</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Alertes stock</h2>
            {alertes.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Tous les stocks sont au-dessus du seuil.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {alertes.map(({ p, c }) => (
                  <li key={p.slug + c.label} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">
                      {p.nom} · {c.label}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 font-semibold ${c.stock === 0 ? "bg-bissap text-white" : "bg-[#d9a521]/15 text-[#a07a10]"}`}>
                      {c.stock === 0 ? "Rupture" : `${c.stock} restant${c.stock > 1 ? "s" : ""}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/admin/stocks" className="mt-4 inline-block text-sm font-semibold text-bissap">
              Gérer les stocks →
            </Link>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Meilleures ventes (30 j)</h2>
            {top.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Pas encore de ventes.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {top.map((t) => (
                  <li key={t.nom} className="flex items-center gap-3 text-sm">
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-line">
                      <Photo id={t.image} alt="" sizes="36px" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{t.nom}</span>
                    <span className="text-muted">×{t.quantite}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
