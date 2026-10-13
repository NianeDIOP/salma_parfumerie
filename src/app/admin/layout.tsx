import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminRacine({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-[#f6f5f2]">{children}</div>;
}
