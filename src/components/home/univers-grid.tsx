import Link from "next/link";
import { Photo } from "@/components/photo";
import type { Univers } from "@/lib/catalogue";

export function UniversGrid({ univers, compte }: { univers: Univers[]; compte: Record<string, number> }) {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="text-6xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl">
          Quatre <span className="text-rose">univers.</span>
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {univers.map((u, i) => (
            <Link
              key={u.slug}
              href={`/${u.slug}`}
              data-cursor="voir"
              className={`group relative h-[460px] overflow-hidden rounded-[2px] lg:h-[560px] ${i % 2 ? "lg:translate-y-16" : ""}`}
              style={{ background: u.theme.bg }}
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Photo id={u.image} alt={u.nom} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${u.theme.bg} 8%, ${u.theme.bg}77 42%, transparent 70%)` }} />
              <div className="absolute inset-x-6 bottom-6">
                <h3 className="text-4xl font-extrabold leading-none tracking-tight">{u.nom}</h3>
                <p className="mt-3 text-base text-white/85">{u.accroche}</p>
                <p className="mt-5 flex items-center gap-2 text-base font-semibold">
                  {compte[u.slug]} produits <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
