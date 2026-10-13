import type { FlaconForme } from "@/lib/catalogue";

interface BottleProps {
  forme: FlaconForme;
  verre: string;
  bouchon: string;
  className?: string;
  label?: boolean;
  shadow?: boolean;
}

// Flacons dessinés en SVG, dans le style des illustrations de la proposition.
// Ils servent de visuels tant que les packshots et modèles 3D ne sont pas produits.
export function Bottle({ forme, verre, bouchon, className, label = true, shadow = true }: BottleProps) {
  // Identifiant déterministe : deux flacons identiques partagent des définitions identiques.
  const id = `b-${forme}-${verre.slice(1)}-${bouchon.slice(1)}`;
  const glass = `url(#${id}-glass)`;
  const cap = `url(#${id}-cap)`;

  return (
    <svg viewBox="0 0 200 270" className={className} role="img" aria-label="Flacon SALMA">
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={verre} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={verre} stopOpacity="0.7" />
          <stop offset="1" stopColor={verre} />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={bouchon} />
          <stop offset="0.5" stopColor={bouchon} stopOpacity="0.8" />
          <stop offset="1" stopColor={bouchon} />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.25" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {shadow && <ellipse cx="100" cy="258" rx="62" ry="7" fill="#000" opacity="0.12" />}

      {forme === "carre" && (
        <g>
          <rect x="78" y="18" width="44" height="52" rx="5" fill={cap} />
          <rect x="97" y="18" width="5" height="52" fill="#a8153a" opacity="0.55" />
          <rect x="88" y="70" width="24" height="16" fill={verre} opacity="0.85" />
          <rect x="38" y="84" width="124" height="168" rx="24" fill={glass} />
          <rect x="38" y="84" width="124" height="168" rx="24" fill={`url(#${id}-shine)`} />
          <rect x="50" y="98" width="7" height="138" rx="3.5" fill="#fff" opacity="0.35" />
        </g>
      )}

      {forme === "rond" && (
        <g>
          <rect x="84" y="16" width="32" height="70" rx="14" fill={cap} />
          <rect x="91" y="80" width="18" height="16" fill={verre} opacity="0.85" />
          <circle cx="100" cy="174" r="80" fill={glass} />
          <circle cx="100" cy="174" r="80" fill={`url(#${id}-shine)`} />
          <path d="M48 140 A62 62 0 0 1 82 104" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.4" />
        </g>
      )}

      {forme === "octogone" && (
        <g>
          <rect x="80" y="20" width="40" height="50" rx="4" fill={cap} />
          <rect x="90" y="70" width="20" height="16" fill={verre} opacity="0.85" />
          <polygon points="70,84 130,84 162,122 162,214 130,252 70,252 38,214 38,122" fill={glass} />
          <polygon points="70,84 130,84 162,122 162,214 130,252 70,252 38,214 38,122" fill={`url(#${id}-shine)`} />
          <polygon points="70,84 100,84 72,120 72,214 92,252 70,252 38,214 38,122" fill="#fff" opacity="0.12" />
        </g>
      )}

      {forme === "fin" && (
        <g>
          <rect x="84" y="14" width="32" height="62" rx="4" fill={cap} />
          <rect x="97" y="14" width="5" height="62" fill="#fff" opacity="0.3" />
          <rect x="70" y="74" width="60" height="180" rx="12" fill={glass} />
          <rect x="70" y="74" width="60" height="180" rx="12" fill={`url(#${id}-shine)`} />
          <rect x="78" y="86" width="5" height="154" rx="2.5" fill="#fff" opacity="0.4" />
        </g>
      )}

      {forme === "pot" && (
        <g>
          <rect x="36" y="110" width="128" height="34" rx="8" fill={cap} />
          <rect x="36" y="110" width="128" height="34" rx="8" fill="#000" opacity="0.06" />
          <rect x="42" y="140" width="116" height="112" rx="18" fill={glass} />
          <rect x="42" y="140" width="116" height="112" rx="18" fill={`url(#${id}-shine)`} />
        </g>
      )}

      {forme === "bougie" && (
        <g>
          <path d="M100 52 C112 74 112 92 100 100 C88 92 88 74 100 52 Z" fill="#f2b33d" />
          <path d="M100 70 C106 82 106 92 100 97 C94 92 94 82 100 70 Z" fill="#fff4cc" />
          <rect x="98.5" y="98" width="3" height="16" fill="#3a2a20" />
          <rect x="44" y="112" width="112" height="140" rx="10" fill={glass} />
          <rect x="44" y="112" width="112" height="140" rx="10" fill={`url(#${id}-shine)`} />
          <ellipse cx="100" cy="114" rx="56" ry="6" fill="#fff" opacity="0.5" />
        </g>
      )}

      {forme === "diffuseur" && (
        <g>
          {[70, 84, 100, 116, 130].map((x, i) => (
            <line key={x} x1="100" y1="120" x2={x} y2={14 + (i % 2) * 14} stroke={bouchon} strokeWidth="3" strokeLinecap="round" />
          ))}
          <rect x="88" y="110" width="24" height="22" fill={bouchon} />
          <rect x="52" y="128" width="96" height="124" rx="20" fill={glass} />
          <rect x="52" y="128" width="96" height="124" rx="20" fill={`url(#${id}-shine)`} />
        </g>
      )}

      {label && <BottleLabel forme={forme} />}
    </svg>
  );
}

function BottleLabel({ forme }: { forme: FlaconForme }) {
  if (forme === "fin") {
    return (
      <g>
        <rect x="80" y="140" width="40" height="40" fill="#fff" />
        <text x="100" y="164" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1a1a" fontFamily="var(--font-grotesk)">
          salma
        </text>
      </g>
    );
  }
  const y = forme === "rond" ? 158 : forme === "pot" ? 178 : forme === "bougie" ? 166 : forme === "diffuseur" ? 172 : 150;
  return (
    <g>
      <rect x="66" y={y} width="68" height="36" fill="#fff" />
      <text x="100" y={y + 23} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1a1a1a" fontFamily="var(--font-grotesk)">
        salma
      </text>
    </g>
  );
}
