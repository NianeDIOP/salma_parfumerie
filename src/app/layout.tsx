import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { CartProvider } from "@/components/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { AnnouncementBar, Header } from "@/components/header";
import { Cursor } from "@/components/motion/cursor";
import { MotionProviders } from "@/components/motion/providers";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SALMA Fragrance · Maison de parfum à Dakar",
    template: "%s · SALMA Fragrance",
  },
  description:
    "Parfums, huiles parfumées, cosmétiques et senteurs d'intérieur. Livraison 24 h à Dakar, paiement Wave, Orange Money, Free Money ou carte.",
};

export const viewport: Viewport = {
  themeColor: "#a8153a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${grotesk.variable} ${code.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <MotionProviders>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Cursor />
          </CartProvider>
        </MotionProviders>
      </body>
    </html>
  );
}
