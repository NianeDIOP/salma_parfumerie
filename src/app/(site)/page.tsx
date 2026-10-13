import { SectionAccueil } from "@/components/home/sections";
import { donneesSite } from "@/lib/data";

// La page d'accueil est entièrement composée depuis l'admin (Apparence › Accueil) :
// ordre, visibilité et contenu de chaque section.
export default async function Home() {
  const donnees = await donneesSite();
  return (
    <>
      {donnees.reglages.accueil
        .filter((s) => s.visible)
        .map((s) => (
          <SectionAccueil key={s.id} section={s} donnees={donnees} />
        ))}
    </>
  );
}
