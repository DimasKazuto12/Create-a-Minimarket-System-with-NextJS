import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { STORE } from "@/lib/store-info";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: { default: `${STORE.name} — ${STORE.tagline}`, template: `%s — ${STORE.name}` },
  description: STORE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${figtree.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}