import Link from "next/link";
import { univers } from "@/lib/catalogue";

const paiements = ["Wave", "Orange Money", "Free Money", "Visa", "Mastercard", "À la livraison"];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="text-4xl font-extrabold tracking-tight">salma</p>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Maison de parfum à Dakar. Parfums, huiles parfumées, cosmétiques et senteurs d&apos;intérieur.
            </p>
            <form className="mt-8 flex max-w-sm border-b border-white/40">
              <input
                type="tel"
                placeholder="Votre numéro pour les nouveautés"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
              />
              <button type="button" className="text-sm font-semibold text-rose">
                S&apos;inscrire
              </button>
            </form>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">Boutique</p>
            <ul className="mt-4 space-y-2 text-sm">
              {univers.map((u) => (
                <li key={u.slug}>
                  <Link href={`/${u.slug}`} className="text-white/80 hover:text-white">
                    {u.nom}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/coffrets" className="text-white/80 hover:text-white">
                  Coffrets & cadeaux
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">Expériences</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <Link href="/quiz" className="hover:text-white">
                  Quiz « Ma Signature »
                </Link>
              </li>
              <li>Cercle SALMA</li>
              <li>Journal olfactif</li>
              <li>Nos boutiques</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">Service</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>Livraison & retours</li>
              <li>FAQ</li>
              <li>Contact & WhatsApp</li>
              <li>CGV · Confidentialité</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {paiements.map((p) => (
              <span key={p} className="border border-white/20 px-3 py-1 font-mono text-[11px] text-white/70">
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/40">© {2026} SALMA Fragrance, Dakar</p>
        </div>
      </div>
    </footer>
  );
}
