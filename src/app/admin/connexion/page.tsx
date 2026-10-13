import { redirect } from "next/navigation";
import { adminConnecte } from "@/lib/auth";
import { lireBase } from "@/lib/db";
import { FormulaireConnexion } from "./formulaire";

export default async function Connexion() {
  if (await adminConnecte()) redirect("/admin");
  const { reglages } = await lireBase();
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-center text-4xl font-extrabold tracking-tight">
          {reglages.identite.logo} <span className="text-base font-medium text-muted">gestion</span>
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold">Connexion administrateur</h1>
          <p className="mt-1 text-sm text-muted">Espace réservé à la gestion du site.</p>
          <FormulaireConnexion />
        </div>
      </div>
    </main>
  );
}
