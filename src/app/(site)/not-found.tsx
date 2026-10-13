import Link from "next/link";
import { Photo } from "@/components/photo";
import { ambiances } from "@/lib/catalogue";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="relative h-56 w-44 animate-float overflow-hidden rounded-t-full bg-rose">
        <Photo id={ambiances.lumiere} alt="" sizes="176px" />
      </div>
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight">Ce sillage s&apos;est évaporé</h1>
      <p className="mt-3 text-muted">La page que vous cherchez n&apos;existe pas ou plus.</p>
      <Link href="/" className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white">
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
