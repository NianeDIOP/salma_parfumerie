import { redirect } from "next/navigation";
import { adminConnecte } from "@/lib/auth";
import { lireBase } from "@/lib/db";
import { FormulaireConnexion } from "./formulaire";

export default async function Connexion() {
  if (await adminConnecte()) redirect("/admin");
  const { reglages } = await lireBase();
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-bissap text-lg font-extrabold text-white">{reglages.identite.logo.charAt(0).toUpperCase()}</span>
          <span className="text-xl font-bold tracking-tight">{reglages.identite.logo}</span>
          <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">Admin</span>
        </div>
        <div className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
          <h1 className="text-base font-semibold">Connexion</h1>
          <p className="mt-0.5 text-xs text-muted">Espace réservé à la gestion du site.</p>
          <FormulaireConnexion />
        </div>
      </div>
    </main>
  );
}
