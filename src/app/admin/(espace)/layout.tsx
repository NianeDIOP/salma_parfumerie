import Link from "next/link";
import { Icone } from "@/components/admin/icones";
import { MenuAdmin } from "@/components/admin/menu";
import { exigerAdmin } from "@/lib/auth";
import { ADMIN_PAR_DEFAUT, lireBase } from "@/lib/db";
import { verifierMotDePasse } from "@/lib/password";

export default async function EspaceAdmin({ children }: LayoutProps<"/admin">) {
  const admin = await exigerAdmin();
  const base = await lireBase();
  const enAttente = base.commandes.filter((c) => c.statut === "en_attente" || c.statut === "payee").length;
  const alertes = base.produits.reduce((n, p) => n + p.contenances.filter((c) => c.stock <= (p.seuilAlerte ?? 5)).length, 0);
  const compte = base.admins.find((a) => a.email === admin.email);
  const motDePasseParDefaut = !!compte && verifierMotDePasse(ADMIN_PAR_DEFAUT.motDePasse, compte.hash);

  return (
    <div className="text-[13px] lg:pl-56">
      <MenuAdmin admin={admin} logo={base.reglages.identite.logo} compteurs={{ commandes: enAttente, stocks: alertes }} />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-6 lg:pt-6">
        {motDePasseParDefaut && (
          <Link href="/admin/parametres#securite" className="mb-4 flex items-center gap-2 rounded-lg border border-[#d9a521]/40 bg-[#d9a521]/10 px-3 py-2 text-xs font-medium text-[#7a5c0c]">
            <Icone nom="alerte" className="size-4 shrink-0" />
            Mot de passe par défaut : changez-le dans Paramètres › Sécurité.
            <span className="ml-auto font-semibold underline">Changer</span>
          </Link>
        )}
        {children}
      </main>
    </div>
  );
}
