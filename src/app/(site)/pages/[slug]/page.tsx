import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageLibre } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/pages/[slug]">): Promise<Metadata> {
  const page = await pageLibre((await params).slug);
  return page ? { title: page.titre } : {};
}

// Pages libres gérées dans l'admin (CGV, FAQ, livraison, contact…).
// Mise en forme simple : « ## » en début de ligne pour un sous-titre, ligne vide entre les paragraphes.
export default async function PageLibre({ params }: PageProps<"/pages/[slug]">) {
  const page = await pageLibre((await params).slug);
  if (!page) notFound();
  const blocs = page.contenu.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-20">
      <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl">{page.titre}</h1>
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/85">
        {blocs.map((b, i) =>
          b.startsWith("## ") ? (
            <h2 key={i} className="pt-4 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              {b.slice(3)}
            </h2>
          ) : (
            <p key={i} className="whitespace-pre-line">
              {b}
            </p>
          ),
        )}
      </div>
    </article>
  );
}
