import Link from "next/link";
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
    <div className="lg:pl-64">
      <MenuAdmin admin={admin} logo={base.reglages.identite.logo} compteurs={{ commandes: enAttente, stocks: alertes }} />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-20 md:px-8 lg:pt-10">
        {motDePasseParDefaut && (
          <Link href="/admin/parametres#securite" className="mb-6 block rounded-2xl bg-bissap px-5 py-4 text-sm font-semibold text-white">
            ⚠ Vous utilisez le mot de passe par défaut. Changez-le maintenant dans Paramètres › Sécurité.
          </Link>
        )}
        {children}
      </main>
    </div>
  );
}
