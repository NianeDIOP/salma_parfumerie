import type { Metadata } from "next";
import { Quiz } from "./quiz";

export const metadata: Metadata = {
  title: "Quiz « Ma Signature »",
  description: "Six questions, soixante secondes : découvrez votre profil olfactif et trois fragrances choisies pour vous.",
};

export default function QuizPage() {
  return <Quiz />;
}
