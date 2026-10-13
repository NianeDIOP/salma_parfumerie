import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bottle } from "@/components/bottle";
import { Catalogue } from "@/components/catalogue";
import { getUnivers, produitsDeUnivers, univers } from "@/lib/catalogue";

export function generateStaticParams() {
  return univers.map((u) => ({ univers: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[univers]">): Promise<Metadata> {
  const u = getUnivers((await params).univers);
  return u ? { title: u.nom, description: u.description } : {};
}

export default async function UniversPage({ params }: PageProps<"/[univers]">) {
  const u = getUnivers((await params).univers);
  if (!u) notFound();
  const produits = produitsDeUnivers(u.slug);
  const vitrine = produits.slice(0, 3);

  return (
    <>
      <section className="bg-rose">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-8 px-4 pb-8 pt-10 md:px-8">
          <div>
            <p className="text-xs text-muted">
              <Link href="/" className="hover:text-ink">
                Accueil
              </Link>{" "}
              › {u.nom}
            </p>
            <h1 className="mt-4 animate-fade-up text-5xl font-extrabold tracking-tight md:text-7xl">{u.nom}</h1>
            <p className="mt-3 max-w-lg text-sm text-muted">
              {u.description} {produits.length} référence{produits.length > 1 ? "s" : ""}.
            </p>
          </div>
          <div className="hidden items-end gap-2 md:flex">
            {vitrine.map((p, i) => (
              <div key={p.slug} className="animate-fade-up" style={{ animationDelay: `${200 + i * 120}ms` }}>
                <Bottle {...p.visuel} className={`${i === 1 ? "h-36" : "h-28"} w-auto`} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Catalogue produits={produits} />
    </>
  );
}
