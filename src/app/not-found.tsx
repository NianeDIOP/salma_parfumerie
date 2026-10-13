import Link from "next/link";
import { Bottle } from "@/components/bottle";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Bottle forme="rond" verre="#e6a3ac" bouchon="#f3e8e3" className="h-40 w-auto animate-float" />
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight">Ce sillage s&apos;est évaporé</h1>
      <p className="mt-3 text-muted">La page que vous cherchez n&apos;existe pas ou plus.</p>
      <Link href="/" className="mt-8 bg-ink px-6 py-3.5 text-sm font-semibold text-white">
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
