import "./globals.css";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk, Big_Shoulders_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import TabTitle from "@/components/TabTitle";
import BackToTop from "@/components/BackToTop";
import CommandPalette from "@/components/CommandPalette";
import { me } from "@/lib/site";
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Space_Grotesk({ subsets: ["latin"], variable: "--font-serif" });
const display = Big_Shoulders_Display({ subsets: ["latin"], weight: "900", variable: "--font-display" });
const title = `${me.name} — ${me.role}`;
export const metadata: Metadata = {
  metadataBase: new URL(me.siteUrl), title: { default: title, template: `%s — ${me.name}` }, description: me.tagline, alternates: { canonical: "/" },
  openGraph: { title, description: me.tagline, url: "/", siteName: me.name, locale: "id_ID", type: "website" },
  twitter: { card: "summary_large_image", title, description: me.tagline } };
export const viewport: Viewport = { themeColor: "#f4f2ec" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = { "@context": "https://schema.org", "@type": "Person", name: me.name, jobTitle: me.role, url: me.siteUrl, email: me.email, sameAs: (me.socials as any[]).map((s) => s.href) };
  return (<html lang="id" className={`${sans.variable} ${serif.variable} ${display.variable}`}><body>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Lompat ke konten</a><Nav /><Cursor /><TabTitle /><BackToTop /><CommandPalette /><SmoothScroll>{children}</SmoothScroll><Analytics />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} /></body></html>);
}
