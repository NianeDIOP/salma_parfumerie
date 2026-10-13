import Link from "next/link";
import { univers } from "@/lib/catalogue";

const paiements = ["Wave", "Orange Money", "Free Money", "Visa", "Mastercard", "À la livraison"];

export function Footer() {
  return (
    <footer className="mt-16 overflow-hidden bg-ink text-white md:mt-32">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
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
            <p className="text-lg font-bold">Boutique</p>
            <ul className="mt-4 space-y-3 text-base md:space-y-2 md:text-sm">
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
            <p className="text-lg font-bold">Expériences</p>
            <ul className="mt-4 space-y-3 text-base text-white/80 md:space-y-2 md:text-sm">
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

          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold">Service</p>
            <ul className="mt-4 space-y-3 text-base text-white/80 md:space-y-2 md:text-sm">
              <li>Livraison & retours</li>
              <li>FAQ</li>
              <li>Contact & WhatsApp</li>
              <li>CGV · Confidentialité</li>
            </ul>
          </div>
        </div>

        <p
          className="mt-12 select-none md:mt-20 bg-gradient-to-b from-white/90 to-white/5 bg-clip-text text-center text-[27vw] font-extrabold leading-[0.8] tracking-tighter text-transparent md:text-[22vw]"
          aria-hidden
        >
          salma
        </p>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {paiements.map((p) => (
              <span key={p} className="border border-white/20 px-3 py-1 text-sm text-white/70">
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
