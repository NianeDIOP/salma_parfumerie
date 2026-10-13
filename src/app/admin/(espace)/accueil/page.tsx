import { EnTetePage } from "@/components/admin/ui";
import { Icone } from "@/components/admin/icones";
import { classeBouton } from "@/components/admin/styles";
import { lireBase } from "@/lib/db";
import { EditeurAccueil } from "./editeur";

export default async function Accueil() {
  const base = await lireBase();
  return (
    <>
      <EnTetePage
        icone="accueil"
        ton="rouge"
        titre="Page d'accueil"
        description="Ajoutez, réordonnez, masquez et modifiez chaque section"
        actions={
          <a href="/" target="_blank" className={classeBouton("secondaire")}>
            <Icone nom="externe" /> Voir l&apos;accueil
          </a>
        }
      />
      <EditeurAccueil sections={base.reglages.accueil} produits={base.produits} univers={base.univers} />
    </>
  );
}
