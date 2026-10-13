"use client";

import { MotionConfig } from "motion/react";

// Défilement natif du navigateur (rapide et fluide) ; les animations respectent
// le réglage « réduire les animations » du téléphone ou de l'ordinateur.
export function MotionProviders({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
