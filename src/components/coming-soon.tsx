"use client";

import Link from "next/link";
import { useSite } from "./site-provider";
import { Photo } from "./photo";

export function ComingSoon({ titre, texte }: { titre: string; texte: string }) {
  const { produits } = useSite();
  const vitrine = produits.slice(0, 3);
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="flex items-end gap-3">
        {vitrine.map((p, i) => (
          <div
            key={p.slug}
            className={`relative animate-fade-up overflow-hidden rounded-t-full ${i === 1 ? "h-44 w-32" : "h-32 w-24"}`}
            style={{ background: p.theme.bg, animationDelay: `${i * 150}ms` }}
          >
            <Photo id={p.images[0]} alt="" sizes="128px" />
          </div>
        ))}
      </div>
      <h1 className="mt-10 text-4xl font-extrabold tracking-tight md:text-5xl">{titre}</h1>
      <p className="mt-4 text-lg text-muted">{texte}</p>
      <Link href="/parfums" className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white">
        Découvrir les parfums
      </Link>
    </section>
  );
}
