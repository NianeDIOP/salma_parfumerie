"use client";

import { useActionState } from "react";
import { connexion } from "@/lib/actions/admin";

export function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(connexion, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Adresse e-mail</span>
        <input name="email" type="email" required defaultValue={etat?.email} key={etat?.email} autoComplete="username" className="w-full rounded-xl border border-line px-3.5 py-3 outline-none focus:border-ink" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Mot de passe</span>
        <input name="motDePasse" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-line px-3.5 py-3 outline-none focus:border-ink" />
      </label>
      {etat?.erreur && <p className="rounded-xl bg-bissap/10 p-3 text-sm font-semibold text-bissap">{etat.erreur}</p>}
      <button disabled={enCours} className="w-full rounded-full bg-ink py-3.5 font-semibold text-white transition hover:bg-bissap disabled:opacity-60">
        {enCours ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
