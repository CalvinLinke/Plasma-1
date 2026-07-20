import type { Metadata } from "next";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import SchemaOrg from "@/components/SchemaOrg";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Vorlagen & Checklisten (kostenlose Downloads)",
  description:
    "Kostenlose Musterbriefe, Checklisten und Vorlagen rund um Strom und Gas: Kündigung, Widerspruch Preiserhöhung, Umzug, Zählerstände, Gewerbe und mehr.",
  alternates: { canonical: "/vorlagen" },
};

type Item = { file: string; title: string; desc: string; xlsx?: string };
type Group = { titel: string; items: Item[] };

const groups: Group[] = [
  {
    titel: "Umzug & Wechsel",
    items: [
      { file: "umzugs-checkliste-energie.html", title: "Umzugs-Checkliste Energie", desc: "Alle Schritte für Strom und Gas rund um den Umzug, mit Zählerstand-Feldern." },
      { file: "uebergabeprotokoll-zaehlerstaende.html", title: "Übergabeprotokoll Zählerstände", desc: "Zählerstände bei Ein- und Auszug sauber dokumentieren." },
      { file: "kuendigung-strom-gas-vorlage.html", title: "Kündigungsvorlage Strom & Gas", desc: "Ausfüllbarer Musterbrief zur fristgerechten Kündigung." },
      { file: "sonderkuendigung-strom-gas.html", title: "Musterbrief Sonderkündigung", desc: "Sonderkündigung bei Preiserhöhung oder Umzug." },
      { file: "vollmacht-anbieterwechsel.html", title: "Vollmacht zur Anbieterummeldung", desc: "Damit wir Kündigung und Wechsel für Sie übernehmen können." },
      { file: "erste-wohnung-energie-starterpaket.html", title: "Erste-Wohnung-Starterpaket", desc: "Grundwissen und Checkliste für die erste eigene Wohnung." },
    ],
  },
  {
    titel: "Preise & Abrechnung",
    items: [
      { file: "widerspruch-preiserhoehung.html", title: "Widerspruch Preiserhöhung", desc: "Musterbrief gegen die angekündigte Preiserhöhung." },
      { file: "stromrechnung-pruefen-checkliste.html", title: "Stromrechnung in 5 Minuten prüfen", desc: "Checkliste für die wichtigsten Posten Ihrer Rechnung." },
      { file: "widerspruch-jahresabrechnung.html", title: "Widerspruch Jahresabrechnung", desc: "Prüf-Checkliste plus Musterbrief bei Fehlern." },
      { file: "abschlag-anpassen-vorlage.html", title: "Abschlag anpassen", desc: "Musterbrief für einen zu hohen oder zu niedrigen Abschlag." },
    ],
  },
  {
    titel: "Gewerbe",
    items: [
      { file: "gewerbe-energiekosten-check.html", title: "Gewerbe-Energiekosten-Check", desc: "Tabelle, die Ihr Einsparpotenzial sichtbar macht.", xlsx: "gewerbe-energiekosten-check.xlsx" },
    ],
  },
  {
    titel: "Wissen & Wohnen",
    items: [
      { file: "oekostrom-siegel-spickzettel.html", title: "Ökostrom-Siegel-Spickzettel", desc: "Echten Ökostrom an den richtigen Labels erkennen." },
      { file: "wg-stromkosten-aufteilung.html", title: "WG-Stromkosten fair aufteilen", desc: "Vorlage für die faire Aufteilung in der WG.", xlsx: "wg-stromkosten-aufteilung.xlsx" },
      { file: "verbrauchs-tagebuch.html", title: "Verbrauchs-Tagebuch", desc: "Zählerstände monatlich festhalten und Nachzahlung früh erkennen.", xlsx: "verbrauchs-tagebuch.xlsx" },
    ],
  },
];

export default function Vorlagen() {
  return (
    <>
      <SchemaOrg
        type="BreadcrumbList"
        data={{ items: [{ name: "Vorlagen & Checklisten", url: "/vorlagen" }] }}
      />
      <header
        className="relative overflow-hidden border-b border-gray-100"
        style={{ background: "linear-gradient(160deg, #EDE9FF 0%, #FFFFFF 45%, #E5F8FF 100%)" }}
      >
        <div
          className="absolute -top-40 -right-24 w-[34rem] h-[34rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(123,97,255,0.28), transparent 70%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-16">
          <Breadcrumbs items={[{ label: "Vorlagen & Checklisten" }]} />
          <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-marine leading-[1.12]">
            Vorlagen & Checklisten
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl leading-relaxed">
            Kostenlose Musterbriefe, Checklisten und Vorlagen rund um Strom und Gas. Herunterladen,
            ausfüllen, fertig. Und wenn Sie sich den Papierkram sparen möchten, laden Sie einfach Ihre
            Rechnung hoch, wir übernehmen den Rest.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 space-y-14">
        {groups.map((g) => (
          <section key={g.titel}>
            <h2 className="text-2xl font-bold tracking-tight text-marine mb-6">{g.titel}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => (
                <div key={it.file} className="flex flex-col">
                  <a
                    href={`/downloads/${it.file}`}
                    download
                    className="group flex flex-1 flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-ambient card-hover"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-brand/10">
                      <FileText className="h-5 w-5 text-violet-brand" />
                    </span>
                    <h3 className="mt-4 font-bold text-marine leading-snug group-hover:text-violet-brand transition-colors">
                      {it.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{it.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-brand">
                      <Download className="h-4 w-4" /> Herunterladen
                    </span>
                  </a>
                  {it.xlsx && (
                    <a
                      href={`/downloads/${it.xlsx}`}
                      download
                      className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-violet-brand/40 hover:text-violet-brand"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" /> Auch als Excel (.xlsx)
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
