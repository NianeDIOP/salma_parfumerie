"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/photo";
import type { Univers } from "@/lib/catalogue";

// Les univers défilent horizontalement pendant que l'on scrolle verticalement (section épinglée).
export function UniversScroll({ univers, compte }: { univers: Univers[]; compte: Record<string, number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  // Distance à parcourir = largeur de la piste moins la largeur de l'écran
  useEffect(() => {
    const mesurer = () => {
      const el = track.current;
      if (!el) return;
      setDistance(window.innerWidth < 768 ? 0 : Math.max(0, el.scrollWidth - window.innerWidth + 64));
    };
    mesurer();
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, []);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[320vh] bg-ink text-white max-md:h-auto">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16 max-md:static max-md:h-auto max-md:py-20">
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-4 md:px-8">
          <h2 className="text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl">
            Quatre
            <br />
            <span className="text-rose">univers.</span>
          </h2>
          <p className="hidden max-w-xs text-sm text-white/60 md:block">
            Faites défiler pour voyager d&apos;un univers olfactif à l&apos;autre.
          </p>
        </div>

        <motion.div ref={track} className="flex w-max gap-6 pl-4 max-md:snap-x max-md:snap-mandatory max-md:w-full max-md:overflow-x-auto md:gap-10 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]" style={{ x }}>
          {univers.map((u, i) => (
            <Link
              key={u.slug}
              href={`/${u.slug}`}
              data-cursor="voir"
              className="group relative h-[62vh] w-[80vw] shrink-0 snap-center overflow-hidden md:h-[64vh] md:w-[46vw] lg:w-[38vw]"
              style={{ background: u.theme.bg }}
            >
              <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[cubic-bezier(.2,.7,.1,1)] group-hover:scale-110">
                <Photo id={u.image} alt={u.nom} sizes="(max-width: 768px) 80vw, 40vw" />
              </div>
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${u.theme.bg} 5%, ${u.theme.bg}66 40%, transparent 70%)` }} />
              <span className="absolute right-5 top-4 font-mono text-sm text-white/80">0{i + 1}</span>
              <div className="absolute inset-x-6 bottom-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">{compte[u.slug]} produits</p>
                <h3 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">{u.nom}</h3>
                <p className="mt-2 max-w-sm text-sm text-white/80">{u.accroche}</p>
                <span className="mt-5 inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-semibold">
                  Explorer <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 hidden w-full max-w-7xl px-8 md:block">
          <div className="h-px bg-white/15">
            <motion.div className="h-full bg-rose" style={{ width: progress }} />
          </div>
        </div>
      </div>
    </section>
  );
}
