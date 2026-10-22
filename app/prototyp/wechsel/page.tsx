import type { Metadata } from "next";
import PrototypRahmen from "../PrototypRahmen";
import WechselFlow from "./WechselFlow";
import { spracheAus } from "@/lib/prototyp-texte";

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
  const sprache = spracheAus(params.lang);

  return (
    <PrototypRahmen sprache={sprache}>
      <WechselFlow campaignCode={code.slice(0, 40)} sprache={sprache} />
    </PrototypRahmen>
  );
}
