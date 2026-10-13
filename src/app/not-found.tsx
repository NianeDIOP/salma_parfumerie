import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Page introuvable</h1>
      <p className="mt-3 text-muted">La page que vous cherchez n&apos;existe pas ou plus.</p>
      <Link href="/" className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white">
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
