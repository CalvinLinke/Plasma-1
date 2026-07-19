import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt zu Plasma Energie Solution: Telefon, E-Mail und Anfrage. Persönliche Energieberatung für Privat- und Gewerbekunden.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
