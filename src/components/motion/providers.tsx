"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

// Défilement fluide (Lenis) + respect du réglage « réduire les animations ».
export function MotionProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
