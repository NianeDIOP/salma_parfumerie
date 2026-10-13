import { EnTetePage } from "@/components/admin/ui";
import { lireBase } from "@/lib/db";
import { EditeurAccueil } from "./editeur";

export default async function Accueil() {
  const base = await lireBase();
  return (
    <>
      <EnTetePage
        titre="Page d'accueil"
        description="Composez l'accueil section par section : ajoutez, réordonnez, masquez et modifiez chaque bloc (titres, textes, images, produits)."
        actions={
          <a href="/" target="_blank" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-ink">
            Voir l&apos;accueil ↗
          </a>
        }
      />
      <EditeurAccueil sections={base.reglages.accueil} produits={base.produits} univers={base.univers} />
    </>
  );
}
