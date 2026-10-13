"use client";

import { useActionState } from "react";
import { classeBouton, classeSaisie } from "@/components/admin/styles";
import { connexion } from "@/lib/actions/admin";

export function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(connexion, null);
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink/70">Adresse e-mail</span>
        <input name="email" type="email" required defaultValue={etat?.email} key={etat?.email} autoComplete="username" className={classeSaisie} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink/70">Mot de passe</span>
        <input name="motDePasse" type="password" required autoComplete="current-password" className={classeSaisie} />
      </label>
      {etat?.erreur && <p className="rounded-lg bg-[#c0392b]/10 px-3 py-2 text-xs font-medium text-[#c0392b]">{etat.erreur}</p>}
      <button disabled={enCours} className={`${classeBouton()} w-full`}>
        {enCours ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
