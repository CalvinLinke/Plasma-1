import type { Metadata } from "next";
import WechselFlow from "./WechselFlow";

export const metadata: Metadata = {
  title: "Stromtarif",
  description: "Prototyp: PLZ und Haushalt, ein Tarifvorschlag, Bestellung ohne Auftrag an Neue Energie.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WechselPrototypPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const raw = params.code;
  const code = (Array.isArray(raw) ? raw[0] : raw)?.trim() || "demo";

  return <WechselFlow campaignCode={code.slice(0, 40)} />;
}
