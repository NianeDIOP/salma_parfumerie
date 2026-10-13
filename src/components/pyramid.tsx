import type { Produit } from "@/lib/catalogue";

// Pyramide olfactive : tête, cœur, fond (voir maquette 3)
export function Pyramid({ pyramide }: { pyramide: Produit["pyramide"] }) {
  const etages = [
    { nom: "Tête", notes: pyramide.tete, fill: "#f2d0d7", text: "#1a1a1a", points: "150,0 205,90 95,90" },
    { nom: "Cœur", notes: pyramide.coeur, fill: "#a8153a", text: "#fff", points: "95,90 205,90 250,170 50,170" },
    { nom: "Fond", notes: pyramide.fond, fill: "#1f2a5c", text: "#fff", points: "50,170 250,170 300,260 0,260" },
  ];
  const centres = [62, 135, 220];

  return (
    <svg viewBox="0 0 300 260" className="w-full max-w-sm" role="img" aria-label="Pyramide olfactive">
      {etages.map((e, i) => (
        <g key={e.nom} className="origin-bottom animate-fade-up" style={{ animationDelay: `${(2 - i) * 180}ms` }}>
          <polygon points={e.points} fill={e.fill} />
          <text x="150" y={centres[i]} textAnchor="middle" fontSize="15" fontWeight="700" fill={e.text}>
            {e.nom}
          </text>
          <text x="150" y={centres[i] + 17} textAnchor="middle" fontSize={i === 0 ? 8 : 10} fill={e.text} opacity="0.9">
            {e.notes.slice(0, i === 0 ? 2 : 4).join(" · ")}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Jauge({ label, valeur, texte }: { label: string; valeur: number; texte: string }) {
  return (
    <div className="grid grid-cols-[70px_1fr_110px] items-center gap-3 text-sm">
      <span className="text-muted">{label}</span>
      <div className="h-1.5 bg-line">
        <div className="h-full bg-ink" style={{ width: `${valeur}%` }} />
      </div>
      <span className="text-xs">{texte}</span>
    </div>
  );
}
