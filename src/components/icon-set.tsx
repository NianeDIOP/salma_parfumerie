// Bibliothèque d'icônes choisissables depuis l'admin (réassurance, etc.)
export const ICONES: Record<string, { nom: string; d: string }> = {
  camion: { nom: "Livraison", d: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  telephone: { nom: "Téléphone", d: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2" },
  bouclier: { nom: "Garantie", d: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" },
  cadeau: { nom: "Cadeau", d: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zM12 7c1.5-3 5-3 5-1s-3 1-5 1z" },
  etoile: { nom: "Étoile", d: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" },
  coeur: { nom: "Cœur", d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" },
  horloge: { nom: "Horloge", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" },
  carte: { nom: "Carte bancaire", d: "M3 6h18v12H3zM3 10h18M7 15h4" },
  fleur: { nom: "Fleur", d: "M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2c2 2 2 4 0 6-2-2-2-4 0-6zM12 16c2 2 2 4 0 6-2-2-2-4 0-6zM2 11c2-2 4-2 6 0-2 2-4 2-6 0zM16 11c2-2 4-2 6 0-2 2-4 2-6 0z" },
  goutte: { nom: "Goutte", d: "M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" },
  sac: { nom: "Sac", d: "M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2" },
  message: { nom: "Message", d: "M4 5h16v11H9l-5 4V5z" },
  check: { nom: "Validé", d: "M20 6L9 17l-5-5" },
  retour: { nom: "Retour", d: "M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" },
  localisation: { nom: "Lieu", d: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
};

export function IconeNommee({ nom, className = "size-6" }: { nom: string; className?: string }) {
  const icone = ICONES[nom] ?? ICONES.etoile;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={icone.d} />
    </svg>
  );
}
