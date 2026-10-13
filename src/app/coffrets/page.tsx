import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Coffrets & cadeaux" };

export default function CoffretsPage() {
  return (
    <ComingSoon
      titre="L'atelier coffrets"
      texte="Composez votre coffret pas à pas : parfum, huile, bougie, écrin et carte message. Le prix se recalcule en temps réel."
    />
  );
}
