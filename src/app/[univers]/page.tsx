import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Parallax } from "@/components/motion/parallax";
import { SplitText } from "@/components/motion/split-text";
import { Photo } from "@/components/photo";
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

  return (
    <>
      <section className="relative isolate flex min-h-[40svh] items-end md:min-h-[62vh] overflow-hidden text-white" style={{ background: u.theme.bg }}>
        <Parallax className="absolute inset-0" offset={90}>
          <Photo id={u.image} alt={u.nom} sizes="100vw" priority />
        </Parallax>
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${u.theme.bg} 8%, ${u.theme.bg}aa 45%, transparent)` }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-6 md:px-8 md:pb-12">
          <p className="hidden text-sm text-white/75 md:block">
            <Link href="/" className="hover:text-white">
              Accueil
            </Link>{" "}
            › {u.nom}
          </p>
          <h1 className="text-5xl font-extrabold leading-[0.88] tracking-tighter md:mt-4 md:text-[9rem]">
            <SplitText text={u.nom} />
          </h1>
          <p className="mt-3 max-w-lg text-base leading-snug text-white/90 md:mt-5 md:text-xl">
            {u.description} {produits.length} référence{produits.length > 1 ? "s" : ""}.
          </p>
        </div>
      </section>
      <Catalogue produits={produits} />
    </>
  );
}
