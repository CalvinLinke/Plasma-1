// Frontmatter-Contract für die markdown-getriebenen Content-Seiten (Ratgeber,
// Wechselanlässe, Tarife). Einsprachig (DE) – kein translationKey/i18n.

export interface FAQ {
  frage: string;
  antwort: string;
  kategorie?: string;
}

/** Load-bearing Taxonomie-Keys (steuern das Routing im Catch-all). */
export type Kategorie = "Ratgeber" | "Wechselanlässe" | "Tarife" | "Übersicht";

export interface PageMeta {
  title: string;
  slug: string;
  kategorie: Kategorie;
  description?: string;
  keywords?: string;
  /** Optionale Hero-Subline für die Flagship-Templates. */
  hero_lead?: string;
  /** Optionale Kennzahl-Kacheln im Flagship-Hero (Money-Pages). */
  stats?: { wert: string; label: string }[];
  /** AEO-Direktantwort (KI-zitierbarer DirectAnswer-Block). Fehlt sie, wird sie
   *  aus der ersten FAQ abgeleitet → ~100 % Abdeckung. */
  direktantwort?: { frage: string; antwort: string };
  faqs?: FAQ[];
  /** Menschliches Label eines Download-Lead-Magnets. */
  lead_magnet?: string;
  /** Dateiname in /public/downloads/, z. B. "umzugs-checkliste-energie.pdf". */
  lead_magnet_file?: string;
  cta_headline?: string;
  cta_description?: string;
  datePublished?: string;
  dateModified?: string;
  /** Optionaler Canonical-Override (absoluter Pfad ab Root). */
  canonical?: string;
  /** Optionale Priorität für Kuratierung/Übersichten. */
  prioritaet?: string;
}

export interface ContentSection {
  heading: string;
  content: string;
}

export interface Page {
  meta: PageMeta;
  content: string;
  htmlContent: string;
}
