"use client";

import { useEffect, useRef } from "react";
import { Bottle } from "./bottle";

const notes = [
  { label: "Oud", x: "14%", y: "18%" },
  { label: "Rose de Taïf", x: "70%", y: "36%" },
  { label: "Ambre", x: "10%", y: "58%" },
  { label: "Safran", x: "72%", y: "70%" },
];

// Particules fixes (pas d'aléatoire au rendu, pour éviter les écarts serveur/client)
const particules = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: 3 + (i % 4) * 2,
  delay: `${(i % 6) * 0.9}s`,
}));

// Flacon vedette : s'incline en suivant la souris (ou l'inclinaison du téléphone).
// Il sera remplacé par une scène Three.js quand les modèles 3D seront livrés.
export function HeroBottle() {
  const scene = useRef<HTMLDivElement>(null);
  const bottle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scene.current;
    const b = bottle.current;
    if (!el || !b || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const apply = (rx: number, ry: number) => {
      b.style.transform = `perspective(900px) rotateY(${ry}deg) rotateX(${rx}deg)`;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      apply(-y * 14, x * 22);
    };
    const onLeave = () => apply(0, 0);
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      apply(Math.max(-12, Math.min(12, (e.beta - 45) / 3)), Math.max(-20, Math.min(20, e.gamma / 2)));
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div ref={scene} className="relative h-full min-h-[420px] overflow-hidden bg-bissap">
      {particules.map((p, i) => (
        <span
          key={i}
          className="absolute animate-drift rounded-full bg-white/50 blur-[1px]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }}
        />
      ))}

      <div className="absolute bottom-0 left-1/2 h-[22%] w-[48%] -translate-x-1/2 bg-rose" />

      {notes.map((n, i) => (
        <span
          key={n.label}
          className="absolute z-10 animate-fade-up bg-white px-2 py-1 font-mono text-[11px] shadow-sm"
          style={{ left: n.x, top: n.y, animationDelay: `${600 + i * 200}ms` }}
        >
          {n.label}
        </span>
      ))}

      <div className="absolute inset-0 grid place-items-center pb-[10%]">
        <div className="animate-float">
          <div ref={bottle} className="transition-transform duration-300 ease-out will-change-transform">
            <Bottle forme="carre" verre="#2c3466" bouchon="#141414" className="h-[300px] w-auto drop-shadow-2xl md:h-[360px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
