"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatFCFA, type Produit } from "@/lib/catalogue";
import { useCart } from "./cart";
import { BagIcon, BoxIcon, ChatIcon, HeartIcon, PhoneIcon, TruckIcon } from "./icons";

const WHATSAPP = "221775665335";

export function ProductBuy({ produit: p }: { produit: Produit }) {
  const { add, setOpen } = useCart();
  const router = useRouter();
  const defaut = p.contenances.find((c) => c.label === "50 ml" && c.stock > 0) ?? p.contenances.find((c) => c.stock > 0) ?? p.contenances[0];
  const [choix, setChoix] = useState(defaut.label);
  const [qte, setQte] = useState(1);
  const c = p.contenances.find((x) => x.label === choix)!;

  const message = encodeURIComponent(`Bonjour SALMA, j'aimerais un conseil sur ${p.nom} (${choix}).`);

  return (
    <div>
      {p.contenances.length > 1 && (
        <fieldset className="mt-6">
          <legend className="mb-2 text-sm font-semibold">Contenance</legend>
          <div className="grid grid-cols-3 gap-2">
            {p.contenances.map((x) => (
              <button
                key={x.label}
                onClick={() => setChoix(x.label)}
                disabled={x.stock === 0}
                className={`border py-3 text-center transition disabled:opacity-40 ${
                  choix === x.label ? "border-ink bg-white ring-1 ring-ink" : "border-line hover:border-ink"
                }`}
              >
                <span className="block text-sm font-semibold">{x.label}</span>
                <span className="block font-mono text-[11px] text-muted">{formatFCFA(x.prix)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <p className="mt-6 text-3xl font-extrabold">
        <span key={choix} className="inline-block animate-fade-up">
          {formatFCFA(c.prix)}
        </span>{" "}
        <span className="text-xs font-normal text-muted">FCFA · ou 3 × {formatFCFA(Math.ceil(c.prix / 3 / 100) * 100)} FCFA</span>
      </p>

      <div className="mt-5 flex gap-2">
        <div className="flex items-center border border-line">
          <button className="px-3 py-3" onClick={() => setQte(Math.max(1, qte - 1))} aria-label="Moins">
            −
          </button>
          <span className="w-6 text-center text-sm">{qte}</span>
          <button className="px-3 py-3" onClick={() => setQte(Math.min(c.stock, qte + 1))} aria-label="Plus">
            +
          </button>
        </div>
        <button
          onClick={() => add(p.slug, choix, qte)}
          disabled={c.stock === 0}
          className="flex flex-1 items-center justify-center gap-2 bg-ink text-sm font-semibold text-white transition hover:bg-bissap disabled:opacity-40"
        >
          <BagIcon className="size-4" /> Ajouter au panier
        </button>
        <button className="border border-line px-4 transition hover:border-ink" aria-label="Ajouter aux favoris">
          <HeartIcon className="size-4" />
        </button>
      </div>

      <button
        onClick={() => {
          add(p.slug, choix, qte);
          setOpen(false);
          router.push("/panier");
        }}
        disabled={c.stock === 0}
        className="mt-2 flex w-full items-center justify-center gap-2 bg-bissap py-3.5 text-sm font-semibold text-white transition hover:bg-bissap-dark disabled:opacity-40"
      >
        <PhoneIcon /> Payer en 1 clic avec Mobile Money
      </button>

      <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
        <li className="flex items-center gap-2">
          <TruckIcon className="size-4 text-bissap" /> <strong>Livré demain</strong> à Dakar si commandé avant 15 h
        </li>
        <li className="flex items-center gap-2">
          <BoxIcon className="size-4 text-bissap" />
          {c.stock === 0 ? "Rupture de stock" : c.stock <= 5 ? `Plus que ${c.stock} en stock` : `En stock · ${c.stock} disponibles`}
        </li>
        <li className="flex items-center gap-2">
          <ChatIcon className="size-4 text-bissap" /> Une question ?{" "}
          <a href={`https://wa.me/${WHATSAPP}?text=${message}`} target="_blank" rel="noopener noreferrer" className="underline">
            Conseillère sur WhatsApp
          </a>
        </li>
      </ul>
    </div>
  );
}
