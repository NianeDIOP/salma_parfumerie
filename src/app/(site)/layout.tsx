import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/components/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Cursor } from "@/components/motion/cursor";
import { SiteProvider } from "@/components/site-provider";
import { donneesSite } from "@/lib/data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const donnees = await donneesSite();
  return (
    <SiteProvider donnees={donnees}>
      <CartProvider>
        <div className="flex min-h-screen flex-col pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-0">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <BottomNav />
        <CartDrawer />
        {donnees.reglages.identite.curseur && <Cursor />}
      </CartProvider>
    </SiteProvider>
  );
}
