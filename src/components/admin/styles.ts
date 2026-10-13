// Styles partagés de l'admin (utilisables côté serveur comme côté navigateur)
export type Variante = "principal" | "secondaire" | "danger" | "discret";

export const stylesBouton: Record<Variante, string> = {
  principal: "bg-ink text-white hover:bg-ink/85",
  secondaire: "border border-line bg-white hover:bg-creme-light hover:border-ink/30",
  danger: "border border-[#c0392b]/25 bg-white text-[#c0392b] hover:bg-[#c0392b] hover:text-white",
  discret: "text-ink/70 hover:bg-ink/5 hover:text-ink",
};

export const classeBouton = (variante: Variante = "principal") =>
  `inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-[13px] font-medium transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${stylesBouton[variante]}`;

export const classeSaisie =
  "h-9 w-full rounded-lg border border-line bg-white px-3 text-[13px] outline-none transition placeholder:text-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/10";

export const classeOnglet = (actif: boolean) =>
  `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition ${actif ? "bg-ink text-white" : "border border-line bg-white text-ink/80 hover:border-ink/30"}`;
