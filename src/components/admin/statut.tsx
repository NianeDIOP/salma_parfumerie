import { statuts, type StatutCommande } from "@/lib/site";
import { Badge } from "./ui";

export function BadgeStatut({ statut }: { statut: StatutCommande }) {
  const s = statuts.find((x) => x.id === statut)!;
  return <Badge couleur={s.couleur}>{s.label}</Badge>;
}

export function dateCourte(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
