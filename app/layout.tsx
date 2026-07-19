import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import SchemaOrg from "@/components/SchemaOrg";
import { siteConfig } from "@/lib/site";

// CSS-Variable --font-inter → wird in globals.css von --font-sans referenziert,
// sodass Body-Text und alle font-sans-Utilities die geladene Inter nutzen.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const DEFAULT_TITLE = "Plasma Energie Solution: Strom & Gas persönlich optimiert";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Plasma Energie Solution",
  },
  description: siteConfig.description,
  keywords:
    "Stromvertrag wechseln, Gasvertrag wechseln, Energieberatung, Stromanbieter wechseln, Gasanbieter vergleichen, Strom ummelden Umzug, Ökostrom, Gewerbestrom",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: DEFAULT_TITLE,
    description: siteConfig.description,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: siteConfig.description,
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="bg-white">
        <SchemaOrg type="LocalBusiness" />
        <SchemaOrg type="WebSite" />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
