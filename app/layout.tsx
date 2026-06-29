import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plasma Energie Solution – Strom & Gas persönlich optimiert",
  description:
    "Unabhängige Beratung für Strom- und Gasverträge — für Privat- und Gewerbekunden. Sie laden Ihre Rechnung hoch – wir erledigen den Rest. Kostenlos und unverbindlich.",
  keywords: "Stromvertrag wechseln, Gasvertrag wechseln, Energieberatung, Stromanbieter, Gasanbieter vergleichen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="bg-white">{children}</body>
    </html>
  );
}
