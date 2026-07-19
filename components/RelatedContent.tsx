import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPagesMeta } from "@/lib/content";

// Kuratierte, silo-übergreifende Verlinkung (Slug → verwandte Slugs).
// Ohne Eintrag wird automatisch nach gleicher Kategorie verlinkt.
const RELATED_MAP: Record<string, string[]> = {
  // Ratgeber
  "ratgeber/stromanbieter-wechseln": ["wechseln/umzug-strom-gas-ummelden", "ratgeber/grundversorgung-erklaert", "ratgeber/energiepreise-verstehen"],
  "ratgeber/gasanbieter-wechseln": ["ratgeber/stromanbieter-wechseln", "tarife/gastarif", "ratgeber/grundversorgung-erklaert"],
  "ratgeber/grundversorgung-erklaert": ["wechseln/raus-aus-der-grundversorgung", "ratgeber/stromanbieter-wechseln", "ratgeber/energiepreise-verstehen"],
  "ratgeber/zaehlerstand-ablesen-uebergabe": ["wechseln/umzug-strom-gas-ummelden", "wechseln/auszug-endabrechnung-strom", "ratgeber/abschlag-nachzahlung-verstehen"],
  "ratgeber/stromvertrag-kuendigen-fristen": ["wechseln/preiserhoehung-anbieter-wechseln", "ratgeber/stromanbieter-wechseln", "ratgeber/grundversorgung-erklaert"],
  "ratgeber/abschlag-nachzahlung-verstehen": ["ratgeber/energiepreise-verstehen", "ratgeber/zaehlerstand-ablesen-uebergabe", "ratgeber/strom-sparen-haushalt"],
  "ratgeber/energiepreise-verstehen": ["ratgeber/abschlag-nachzahlung-verstehen", "ratgeber/stromanbieter-wechseln", "tarife/oekostrom"],
  "ratgeber/strom-sparen-haushalt": ["ratgeber/energiepreise-verstehen", "ratgeber/abschlag-nachzahlung-verstehen", "tarife/waermepumpenstrom"],
  // Wechselanlässe
  "wechseln/umzug-strom-gas-ummelden": ["wechseln/erste-eigene-wohnung-strom-anmelden", "ratgeber/zaehlerstand-ablesen-uebergabe", "wechseln/raus-aus-der-grundversorgung"],
  "wechseln/erste-eigene-wohnung-strom-anmelden": ["wechseln/umzug-strom-gas-ummelden", "ratgeber/stromanbieter-wechseln", "wechseln/wg-gruendung-strom-anmelden"],
  "wechseln/neubau-erstbezug-energie-anmelden": ["wechseln/umzug-strom-gas-ummelden", "tarife/waermepumpenstrom", "wechseln/erste-eigene-wohnung-strom-anmelden"],
  "wechseln/zuzug-nach-deutschland-strom-anmelden": ["wechseln/erste-eigene-wohnung-strom-anmelden", "ratgeber/grundversorgung-erklaert", "wechseln/umzug-strom-gas-ummelden"],
  "wechseln/auszug-endabrechnung-strom": ["ratgeber/zaehlerstand-ablesen-uebergabe", "wechseln/umzug-strom-gas-ummelden", "ratgeber/abschlag-nachzahlung-verstehen"],
  "wechseln/raus-aus-der-grundversorgung": ["ratgeber/grundversorgung-erklaert", "ratgeber/stromanbieter-wechseln", "ratgeber/energiepreise-verstehen"],
  "wechseln/wg-gruendung-strom-anmelden": ["wechseln/erste-eigene-wohnung-strom-anmelden", "ratgeber/abschlag-nachzahlung-verstehen", "ratgeber/zaehlerstand-ablesen-uebergabe"],
  "wechseln/preiserhoehung-anbieter-wechseln": ["ratgeber/stromvertrag-kuendigen-fristen", "ratgeber/stromanbieter-wechseln", "wechseln/raus-aus-der-grundversorgung"],
  "wechseln/anbieter-insolvent-ersatzversorgung": ["ratgeber/grundversorgung-erklaert", "wechseln/raus-aus-der-grundversorgung", "ratgeber/stromanbieter-wechseln"],
  // Tarife
  "tarife/oekostrom": ["ratgeber/stromanbieter-wechseln", "ratgeber/energiepreise-verstehen", "tarife/gastarif"],
  "tarife/gastarif": ["ratgeber/gasanbieter-wechseln", "tarife/oekostrom", "ratgeber/energiepreise-verstehen"],
  "tarife/gewerbestrom": ["tarife/gewerbegas", "tarife/oekostrom", "ratgeber/energiepreise-verstehen"],
  "tarife/gewerbegas": ["tarife/gewerbestrom", "tarife/gastarif", "ratgeber/gasanbieter-wechseln"],
  "tarife/waermepumpenstrom": ["tarife/heizstrom-nachtspeicher", "tarife/wallbox-autostrom", "wechseln/neubau-erstbezug-energie-anmelden"],
  "tarife/heizstrom-nachtspeicher": ["tarife/waermepumpenstrom", "ratgeber/energiepreise-verstehen", "tarife/oekostrom"],
  "tarife/wallbox-autostrom": ["tarife/waermepumpenstrom", "tarife/oekostrom", "ratgeber/strom-sparen-haushalt"],
  // Neue Themen 2026
  "tarife/dynamische-stromtarife": ["tarife/wallbox-autostrom", "ratgeber/smart-meter-pflicht", "ratgeber/e-auto-zuhause-laden-stromtarif"],
  "tarife/reststrom-photovoltaik": ["tarife/dynamische-stromtarife", "tarife/oekostrom", "ratgeber/strom-sparen-haushalt"],
  "ratgeber/e-auto-zuhause-laden-stromtarif": ["tarife/wallbox-autostrom", "tarife/dynamische-stromtarife", "ratgeber/14a-enwg-steuerbare-verbraucher"],
  "ratgeber/14a-enwg-steuerbare-verbraucher": ["tarife/waermepumpenstrom", "tarife/wallbox-autostrom", "tarife/dynamische-stromtarife"],
  "ratgeber/smart-meter-pflicht": ["tarife/dynamische-stromtarife", "ratgeber/energiepreise-verstehen", "ratgeber/strom-sparen-haushalt"],
  "ratgeber/strompreis-entlastung-2026": ["ratgeber/energiepreise-verstehen", "ratgeber/stromanbieter-wechseln", "ratgeber/abschlag-nachzahlung-verstehen"],
  "ratgeber/gaspreise-2026": ["ratgeber/gasanbieter-wechseln", "tarife/gastarif", "ratgeber/energiepreise-verstehen"],
};

const KAT_LABEL: Record<string, string> = {
  Ratgeber: "Ratgeber",
  Wechselanlässe: "Wechselanlass",
  Tarife: "Tarif",
};

export default function RelatedContent({
  currentSlug,
  kategorie,
}: {
  currentSlug: string;
  kategorie: string;
}) {
  const all = getAllPagesMeta();
  const override = RELATED_MAP[currentSlug];

  let related = override
    ? override.map((s) => all.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p)
    : all.filter(
        (p) => p.kategorie === kategorie && p.slug !== currentSlug && p.slug.includes("/"),
      );

  related = related.slice(0, 3);
  if (!related.length) return null;

  return (
    <section aria-label="Verwandte Beiträge">
      <h2 className="text-2xl font-bold tracking-tight text-marine mb-6">Das könnte Sie auch interessieren</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-ambient card-hover"
          >
            <span className="inline-flex w-fit rounded-full bg-violet-brand/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-violet-brand">
              {KAT_LABEL[p.kategorie ?? ""] ?? "Beitrag"}
            </span>
            <h3 className="mt-3 font-bold text-marine leading-snug group-hover:text-violet-brand transition-colors">
              {p.title}
            </h3>
            {p.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{p.description}</p>
            )}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-brand">
              Lesen <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
