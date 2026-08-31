export type InvoiceAnalysis = {
  status: "ok" | "partial" | "failed" | "image_no_ocr";
  energieart?: "strom" | "gas";
  anbieter?: string;
  tarif?: string;
  kundennummer?: string;
  zaehlernummer?: string;
  rechnungsdatum?: string;
  zeitraum?: string;
  verbrauchKwh?: number;
  arbeitspreisCtKwh?: number;
  grundpreisEurJahr?: number;
  gesamtbetragEur?: number;
  notizen: string[];
  rawTextPreview?: string;
};

function normalizeWhitespace(text: string): string {
  return text.replace(/\r/g, "\n").replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").trim();
}

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return undefined;
}

function parseGermanNumber(value: string): number | undefined {
  const cleaned = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : undefined;
}

function parseDate(value: string): string | undefined {
  const de = value.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (de) {
    const [, d, m, y] = de;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  return iso ? iso[0] : undefined;
}

export function parseInvoiceText(text: string): InvoiceAnalysis {
  const normalized = normalizeWhitespace(text);
  const lower = normalized.toLowerCase();
  const notizen: string[] = [];

  const energieart = lower.includes("erdgas") || /\bgas\b/.test(lower)
    ? "gas"
    : lower.includes("strom") || lower.includes("kwh")
      ? "strom"
      : undefined;

  const anbieter = firstMatch(normalized, [
    /(?:Anbieter|Lieferant|Ihr Energieversorger)[:\s]+([^\n]{3,80})/i,
    /(Vattenfall|E\.ON|EON|EnBW|RWE|eprimo|LichtBlick|Yello|Maingau|Entega|SW[KL]\s?\w+|Stadtwerke[^\n]{0,40})/i,
  ]);

  const tarif = firstMatch(normalized, [
    /(?:Tarif|Produkt|Vertrag)[:\s]+([^\n]{3,80})/i,
  ]);

  const kundennummer = firstMatch(normalized, [
    /(?:Kunden(?:nummer|-nr\.?)|Vertragskonto)[:\s#]*([A-Z0-9][A-Z0-9\-\/]{4,})/i,
  ]);

  const zaehlernummer = firstMatch(normalized, [
    /(?:Z[äa]hlernummer|Z[äa]hler[- ]?Nr\.?|Messlokation|MaLo)[:\s#]*([A-Z0-9][A-Z0-9\-]{4,})/i,
  ]);

  const rechnungsdatumRaw = firstMatch(normalized, [
    /(?:Rechnungsdatum|Datum der Rechnung|Rechnung vom)[:\s]+([^\n]{6,20})/i,
  ]);
  const rechnungsdatum = rechnungsdatumRaw ? parseDate(rechnungsdatumRaw) : undefined;

  const zeitraum = firstMatch(normalized, [
    /(?:Abrechnungszeitraum|Leistungszeitraum|Zeitraum)[:\s]+([^\n]{8,40})/i,
    /(\d{1,2}\.\d{1,2}\.\d{4}\s*[-–]\s*\d{1,2}\.\d{1,2}\.\d{4})/,
  ]);

  const verbrauchRaw = firstMatch(normalized, [
    /(?:Verbrauch|Arbeitsmenge)[:\s]+([\d.,\s]+)\s*kWh/i,
    /([\d.,\s]+)\s*kWh/i,
  ]);
  const verbrauchKwh = verbrauchRaw ? parseGermanNumber(verbrauchRaw) : undefined;

  const arbeitspreisRaw = firstMatch(normalized, [
    /(?:Arbeitspreis|Energy price)[:\s]+([\d.,\s]+)\s*(?:ct|Cent)[^\n]*(?:kWh)/i,
    /([\d.,\s]+)\s*ct\s*\/\s*kWh/i,
  ]);
  const arbeitspreisCtKwh = arbeitspreisRaw ? parseGermanNumber(arbeitspreisRaw) : undefined;

  const grundpreisRaw = firstMatch(normalized, [
    /(?:Grundpreis|Grundgebühr)[:\s]+([\d.,\s]+)\s*€[^\n]*(?:Jahr|a\b)/i,
    /([\d.,\s]+)\s*€\s*\/\s*(?:Jahr|a\b)/i,
  ]);
  const grundpreisEurJahr = grundpreisRaw ? parseGermanNumber(grundpreisRaw) : undefined;

  const gesamtRaw = firstMatch(normalized, [
    /(?:Rechnungsbetrag|Gesamtbetrag|Zu zahlen|Endbetrag)[:\s]+([\d.,\s]+)\s*€/i,
    /([\d.,\s]+)\s*€[^\n]{0,20}(?:Rechnungsbetrag|Gesamtbetrag)/i,
  ]);
  const gesamtbetragEur = gesamtRaw ? parseGermanNumber(gesamtRaw) : undefined;

  const foundFields = [
    energieart,
    anbieter,
    tarif,
    kundennummer,
    zaehlernummer,
    rechnungsdatum,
    zeitraum,
    verbrauchKwh,
    arbeitspreisCtKwh,
    grundpreisEurJahr,
    gesamtbetragEur,
  ].filter(Boolean).length;

  if (foundFields === 0) notizen.push("Keine strukturierten Felder erkannt — Text evtl. gescanntes Bild.");
  if (!anbieter) notizen.push("Anbieter nicht eindeutig erkannt.");
  if (!verbrauchKwh) notizen.push("Verbrauch (kWh) nicht gefunden.");

  const status: InvoiceAnalysis["status"] =
    foundFields >= 4 ? "ok" : foundFields >= 1 ? "partial" : "failed";

  return {
    status,
    energieart,
    anbieter,
    tarif,
    kundennummer,
    zaehlernummer,
    rechnungsdatum,
    zeitraum,
    verbrauchKwh,
    arbeitspreisCtKwh,
    grundpreisEurJahr,
    gesamtbetragEur,
    notizen,
    rawTextPreview: normalized.slice(0, 1500),
  };
}
