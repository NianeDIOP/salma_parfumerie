import type { Metadata } from "next";
import { Checkout } from "./checkout";

export const metadata: Metadata = { title: "Panier & paiement" };

export default function PanierPage() {
  return <Checkout />;
}
