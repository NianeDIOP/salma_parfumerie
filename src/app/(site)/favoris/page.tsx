import type { Metadata } from "next";
import { Favoris } from "./favoris";

export const metadata: Metadata = { title: "Favoris" };

export default function FavorisPage() {
  return <Favoris />;
}
