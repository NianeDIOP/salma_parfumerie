"use client";

import { SearchIcon } from "./icons";

// Champ de recherche (style application) qui ouvre la recherche plein écran.
export function RechercheBouton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("salma:recherche"))}
      className={`flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-base text-muted shadow-sm ring-1 ring-line ${className}`}
    >
      <SearchIcon className="size-5 text-ink" />
      Parfum, marque, note…
    </button>
  );
}
