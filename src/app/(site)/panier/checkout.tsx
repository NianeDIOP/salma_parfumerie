"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Photo } from "@/components/photo";
import { useCart } from "@/components/cart";
import { useSite } from "@/components/site-provider";
import { passerCommande, verifierCode } from "@/lib/actions/commande";
import { formatFCFA } from "@/lib/catalogue";
import { moyensPaiement, type MoyenPaiement } from "@/lib/site";

const etapes = ["Panier", "Livraison", "Paiement"];

export function Checkout() {
  const router = useRouter();
  const { lines, total, update, clear, prixLigne } = useCart();
  const { getProduit, produits, reglages } = useSite();
  const zones = reglages.livraison.zones.filter((z) => z.actif);
  const moyens = moyensPaiement.filter((m) => reglages.paiements[m.id]);
  const echantillons = reglages.livraison.echantillonOffert ? produits.filter((p) => p.univers === "parfums").slice(0, 4) : [];

  const [etape, setEtape] = useState(0);
  const [code, setCode] = useState("");
  const [codeApplique, setCodeApplique] = useState<{ code: string; remise: number } | null>(null);
  const [erreurCode, setErreurCode] = useState("");
  const [echantillon, setEchantillon] = useState(echantillons[0]?.slug ?? null);
  const [zone, setZone] = useState(zones[0]?.id ?? "");
  const [moyen, setMoyen] = useState<MoyenPaiement>(moyens[0]?.id ?? "livraison");
  const [form, setForm] = useState({ nom: "", tel: "", adresse: "", repere: "", message: "" });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const z = zones.find((x) => x.id === zone) ?? zones[0];
  const remise = codeApplique?.remise ?? 0;
  const frais = !z ? 0 : z.gratuiteDes && total >= z.gratuiteDes ? 0 : z.frais;
  const totalFinal = total - remise + frais;

  if (!lines.length) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Votre panier est vide</h1>
        <Link href="/parfums" className="mt-8 inline-block bg-ink px-6 py-3.5 text-sm font-semibold text-white">
          Découvrir les parfums
        </Link>
      </section>
    );
  }

  const payer = async () => {
    setEnvoi(true);
    setErreur("");
    // Paiement simulé pour l'instant : l'agrégateur (PayDunya / CinetPay / PayTech) sera branché ici.
    const res = await passerCommande({
      lignes: lines,
      client: { nom: form.nom, telephone: form.tel, adresse: form.adresse, repere: form.repere },
      zone,
      moyen,
      code: codeApplique?.code ?? "",
      echantillon,
      message: form.message,
    });
    if (!res.ok) {
      setErreur(res.message);
      setEnvoi(false);
      return;
    }
    clear();
    router.push(`/commande/${res.numero}`);
  };

  const livraisonValide = form.nom.trim() && /^[0-9 +]{9,}$/.test(form.tel) && (zone === "boutique" || form.adresse.trim());

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1fr_380px]">
      <div>
        <ol className="mb-10 flex border-b border-line">
          {etapes.map((e, i) => (
            <li key={e} className="flex-1">
              <button
                disabled={i > etape}
                onClick={() => setEtape(i)}
                className={`w-full border-b-2 pb-3 text-sm transition ${i === etape ? "border-bissap font-semibold text-bissap" : i < etape ? "border-ink" : "border-transparent text-muted"}`}
              >
                {e}
              </button>
            </li>
          ))}
        </ol>

        {etape === 0 && (
          <div className="animate-fade-up">
            <h1 className="text-3xl font-extrabold tracking-tight">Votre panier</h1>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {lines.map((l) => {
                const p = getProduit(l.slug);
                if (!p) return null;
                return (
                  <li key={`${l.slug}-${l.contenance}`} className="flex items-center gap-4 py-4">
                    <div className="relative size-20 shrink-0 overflow-hidden" style={{ background: p.theme.bg }}>
                      <Photo id={p.images[0]} alt="" sizes="80px" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{p.nom}</p>
                      <p className="text-xs text-muted">{l.contenance}</p>
                      <div className="mt-2 inline-flex items-center border border-line text-sm">
                        <button className="px-3 py-1" onClick={() => update(l.slug, l.contenance, l.quantite - 1)}>
                          −
                        </button>
                        <span className="w-6 text-center">{l.quantite}</span>
                        <button className="px-3 py-1" onClick={() => update(l.slug, l.contenance, l.quantite + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <p className="tabular-nums">{formatFCFA(prixLigne(l))}</p>
                  </li>
                );
              })}
            </ul>

            {echantillons.length > 0 && <h2 className="mt-10 font-bold">Votre échantillon offert</h2>}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {echantillons.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setEchantillon(p.slug)}
                  className={`p-3 text-center text-xs transition ${echantillon === p.slug ? "bg-white ring-2 ring-ink" : "bg-creme-light ring-1 ring-line"}`}
                >
                  <span className="relative mx-auto block size-16 overflow-hidden rounded-full" style={{ background: p.theme.bg }}>
                    <Photo id={p.images[0]} alt="" sizes="64px" />
                  </span>
                  <span className="mt-2 block font-semibold">{p.nom}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setEtape(1)} className="mt-10 w-full bg-ink py-4 font-semibold text-white">
              Continuer vers la livraison
            </button>
          </div>
        )}

        {etape === 1 && (
          <div className="animate-fade-up space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight">Livraison</h1>
            <div className="grid gap-2">
              {zones.map((x) => (
                <label key={x.id} className={`flex cursor-pointer items-center gap-3 p-4 ${zone === x.id ? "bg-white ring-2 ring-ink" : "ring-1 ring-line"}`}>
                  <input type="radio" name="zone" checked={zone === x.id} onChange={() => setZone(x.id)} className="accent-ink" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{x.label}</span>
                    <span className="text-xs text-muted">{x.delai}</span>
                  </span>
                  <span className="text-base font-semibold tabular-nums">
                    {x.gratuiteDes && total >= x.gratuiteDes ? "Offerte" : x.frais ? `${formatFCFA(x.frais)} F` : "Gratuit"}
                  </span>
                </label>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Champ label="Nom complet" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} />
              <Champ label="Téléphone" type="tel" placeholder="77 000 00 00" value={form.tel} onChange={(v) => setForm({ ...form, tel: v })} />
              {zone !== "boutique" && (
                <>
                  <Champ label="Adresse / quartier" value={form.adresse} onChange={(v) => setForm({ ...form, adresse: v })} />
                  <Champ label="Point de repère" placeholder="Ex. : près de la pharmacie" value={form.repere} onChange={(v) => setForm({ ...form, repere: v })} />
                </>
              )}
            </div>
            <Champ label="Message cadeau (facultatif)" value={form.message} onChange={(v) => setForm({ ...form, message: v })} />
            <p className="text-xs text-muted">Pas besoin de créer de compte : vous recevrez le suivi par SMS ou WhatsApp.</p>
            <button
              onClick={() => setEtape(2)}
              disabled={!livraisonValide}
              className="w-full bg-ink py-4 font-semibold text-white disabled:opacity-30"
            >
              Continuer vers le paiement
            </button>
          </div>
        )}

        {etape === 2 && (
          <div className="animate-fade-up">
            <h1 className="text-3xl font-extrabold tracking-tight">Paiement</h1>
            <p className="mt-2 text-sm text-muted">Choisissez votre moyen de paiement</p>
            <div className="mt-6 grid gap-2">
              {moyens.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-3 p-4 ${moyen === m.id ? "bg-white ring-2 ring-ink" : "ring-1 ring-line"}`}>
                  <span className="grid size-9 place-items-center text-xs font-bold text-white" style={{ background: m.couleur }}>
                    {m.sigle}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{m.label}</span>
                    {m.detail && <span className="text-xs text-muted">{m.detail}</span>}
                  </span>
                  <input type="radio" name="moyen" checked={moyen === m.id} onChange={() => setMoyen(m.id)} className="size-4 accent-ink" />
                </label>
              ))}
            </div>
            {["wave", "om", "free"].includes(moyen) && (
              <p className="mt-4 bg-rose-soft p-4 text-sm">
                Une demande de paiement sera envoyée au <strong>{form.tel}</strong>. Validez-la sur votre téléphone.
              </p>
            )}
            {erreur && <p className="mt-6 rounded-xl bg-rose-soft p-4 text-sm font-semibold text-bissap">{erreur}</p>}
            <button
              onClick={payer}
              disabled={envoi}
              className="mt-8 flex w-full items-center justify-center gap-2 bg-bissap py-4 font-semibold text-white transition hover:bg-bissap-dark disabled:opacity-70"
            >
              {envoi ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> En attente de validation…
                </>
              ) : (
                <>🔒 Payer {formatFCFA(totalFinal)} FCFA</>
              )}
            </button>
          </div>
        )}
      </div>

      <aside className="h-fit bg-creme-light p-6 lg:sticky lg:top-24">
        <h2 className="font-bold">Récapitulatif</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Sous-total</dt>
            <dd className="tabular-nums">{formatFCFA(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Livraison</dt>
            <dd className="tabular-nums">{frais ? formatFCFA(frais) : "Offerte"}</dd>
          </div>
          {remise > 0 && (
            <div className="flex justify-between text-bissap">
              <dt>Code {codeApplique?.code}</dt>
              <dd className="tabular-nums">− {formatFCFA(remise)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatFCFA(totalFinal)} FCFA</dd>
          </div>
        </dl>
        <form
          className="mt-6 flex border border-line bg-white"
          onSubmit={async (e) => {
            e.preventDefault();
            setErreurCode("");
            const res = await verifierCode(code, total);
            if (res.ok) setCodeApplique({ code: res.code, remise: res.remise });
            else {
              setCodeApplique(null);
              setErreurCode(res.message);
            }
          }}
        >
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code promo" className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" />
          <button className="px-4 text-sm font-semibold">OK</button>
        </form>
        {erreurCode && <p className="mt-2 text-sm text-bissap">{erreurCode}</p>}
        {codeApplique && <p className="mt-2 text-sm text-sauge">Code {codeApplique.code} appliqué.</p>}
      </aside>
    </section>
  );
}

function Champ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line bg-white px-3 py-3 outline-none focus:border-ink"
      />
    </label>
  );
}
