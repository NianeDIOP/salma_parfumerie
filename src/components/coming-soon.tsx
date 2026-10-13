import Link from "next/link";
import { Bottle } from "./bottle";

export function ComingSoon({ titre, texte }: { titre: string; texte: string }) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="flex items-end gap-3">
        <Bottle forme="octogone" verre="#c98a2b" bouchon="#141414" className="h-28 w-auto" />
        <Bottle forme="carre" verre="#7a1f35" bouchon="#141414" className="h-36 w-auto animate-float" />
        <Bottle forme="bougie" verre="#f3ecd9" bouchon="#f3ecd9" className="h-24 w-auto" />
      </div>
      <p className="mt-10 font-mono text-xs text-bissap">Bientôt disponible</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{titre}</h1>
      <p className="mt-4 text-muted">{texte}</p>
      <Link href="/parfums" className="mt-8 bg-ink px-6 py-3.5 text-sm font-semibold text-white">
        Découvrir les parfums
      </Link>
    </section>
  );
}
