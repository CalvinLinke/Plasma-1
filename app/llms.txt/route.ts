import { getPagesByKategorie } from "@/lib/content";
import { siteConfig, company } from "@/lib/site";

export const dynamic = "force-static";

const SILOS: Array<{ kategorie: string; heading: string }> = [
  { kategorie: "Ratgeber", heading: "Ratgeber (Wissen)" },
  { kategorie: "Wechselanlässe", heading: "Wechselanlässe: Umzug & Situationen" },
  { kategorie: "Tarife", heading: "Tarife & Vertragsarten" },
];

export async function GET() {
  const L: string[] = [];
  const push = (s = "") => L.push(s);

  push(`# ${siteConfig.name}`);
  push();
  push(
    "> Unabhängiger Energievermittler für Strom- und Gasverträge, für Privat- und Gewerbekunden, deutschlandweit. Persönliche Beratung statt anonymes Vergleichsportal: Rechnung hochladen, wir übernehmen Vergleich, Wechsel und Betreuung. Kostenlos und unverbindlich.",
  );
  push();

  push("## Auf einen Blick");
  push(`- **Unternehmen:** ${siteConfig.name} (Geschäftsführung ${company.founderName})`);
  push(`- **Leistungen:** Vermittlung & Optimierung von Strom- und Gasverträgen (Privat & Gewerbe), Anbieterwechsel, Energiekosten-Analyse, Betreuung`);
  push(`- **Einzugsgebiet:** deutschlandweit; Firmensitz ${company.address.street}, ${company.address.postalCode} ${company.address.city}`);
  push(`- **Besonderheit:** persönlicher Ansprechpartner, unabhängig, kein Energieversorger; Angebot per Rechnungs-Upload`);
  push(`- **Erlaubnis:** Gewerbe nach § 34c GewO`);
  push(`- **Telefon:** ${company.phone.display}`);
  push(`- **E-Mail:** ${company.email}`);
  push(`- **Website:** ${siteConfig.url}`);
  push(`- **Angebot anfordern:** ${siteConfig.url}/angebot-erhalten`);
  push();

  push("## Zielgruppen");
  push("- Privatkunden (Haushalte, Umziehende, Erstbezug, Wohnungswechsel)");
  push("- Gewerbekunden (Strom & Gas für Unternehmen)");
  push("- Hausverwaltungen");
  push();

  for (const silo of SILOS) {
    const pages = getPagesByKategorie(silo.kategorie).sort((a, b) =>
      (a.title ?? "").localeCompare(b.title ?? "", "de"),
    );
    if (!pages.length) continue;
    push(`## ${silo.heading}`);
    for (const p of pages) {
      const desc = p.description ? `: ${p.description}` : "";
      push(`- [${p.title}](${siteConfig.url}/${p.slug})${desc}`);
    }
    push();
  }

  push("## Wichtige Seiten");
  push(`- [Leistungen für Privatkunden](${siteConfig.url}/leistungen/privatkunden)`);
  push(`- [Leistungen für Gewerbekunden](${siteConfig.url}/leistungen/gewerbekunden)`);
  push(`- [Leistungen für Hausverwaltungen](${siteConfig.url}/leistungen/hausverwaltungen)`);
  push(`- [Über uns](${siteConfig.url}/ueber-uns)`);
  push(`- [Angebot erhalten](${siteConfig.url}/angebot-erhalten)`);
  push(`- [Kontakt](${siteConfig.url}/kontakt)`);
  push();

  return new Response(L.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
