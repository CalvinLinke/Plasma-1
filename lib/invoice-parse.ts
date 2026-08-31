export type ParsedInvoiceAddress = {
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
};

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
  strasse?: string;
  hausnummer?: string;
  plz?: string;
  ort?: string;
  iban?: string;
  kontoinhaber?: string;
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

const PROVIDER_ADDRESS_HINT =
  /\b(Postfach|Postf\.| GmbH| AG| SE\b|Versorgung|Kundenservice|Zentrale|Firmensitz|Amtsgericht|Handelsregister|USt|Steuer-Nr|HRB|Geschäftsführ)/i;

const ADDRESS_LABEL =
  /(?:Lieferadresse|Verbrauchsstelle|Lieferstelle|Anschlussadresse|Liefer- und Rechnungsadresse|Rechnungsadresse|Verbrauchsstelle\/Lieferadresse)[:\s]+([\s\S]{5,160}?)(?=\n(?:Kunden|Vertrags|Zähler|MaLo|Rechnungsnummer|Rechnungs|IBAN|Telefon|E-Mail|Datum|Tarif|Anbieter|Sehr|Online)\b|\n\n|$)/i;

const LIEFERSTELLE_INLINE =
  /Lieferstelle:\s*([^\n]{3,80})\n\s*(\d{5})\s+([^\n]{1,40})/i;

const POSTANSCHRIFT_BLOCK =
  /Postanschrift\s*\n(?:Frau|Herr)\s*\n[^\n]+\n([^\n]{3,80})\n(\d{5})\s+([^\n]{1,40})/i;

function splitStreetAndNumber(streetLine: string): { strasse: string; hausnummer: string } {
  const trimmed = streetLine.replace(/[,;]+$/, "").trim();
  const match = trimmed.match(/^(.+?)\s+(\d+\s*[a-zA-Z]?)$/);
  if (!match) return { strasse: trimmed, hausnummer: "" };
  return { strasse: match[1].trim(), hausnummer: match[2].trim() };
}

function parsePlzOrtLine(line: string): { plz: string; ort: string } | null {
  const match = line.match(/\b(\d{5})\s+([A-ZÄÖÜ][A-Za-zäöüßÄÖÜ\s.-]{1,40})/);
  if (!match) return null;
  return { plz: match[1], ort: match[2].trim() };
}

function parseAddressFromBlock(block: string): ParsedInvoiceAddress | null {
  const compact = block.replace(/\s+/g, " ").trim();
  if (!compact || PROVIDER_ADDRESS_HINT.test(compact)) return null;

  const inline = compact.match(
    /([A-Za-zÄÖÜäöüß0-9][^,\n]{2,70}?)\s+(\d+[a-zA-Z]?)\s*,?\s*(\d{5})\s+([A-Za-zÄÖÜäöüß][A-Za-zäöüßÄÖÜ\s.-]{1,40})/,
  );
  if (inline) {
    return {
      strasse: inline[1].trim(),
      hausnummer: inline[2].trim(),
      plz: inline[3],
      ort: inline[4].trim(),
    };
  }

  const lines = block
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i += 1) {
    const plzOrt = parsePlzOrtLine(lines[i]);
    if (!plzOrt) continue;

    const streetLine = lines[i - 1] ?? lines[i].replace(/\b\d{5}\s.+$/, "").trim();
    if (!streetLine || PROVIDER_ADDRESS_HINT.test(streetLine)) continue;

    const { strasse, hausnummer } = splitStreetAndNumber(streetLine);
    if (strasse.length < 3) continue;

    return { strasse, hausnummer, ...plzOrt };
  }

  return null;
}

export function parseInvoiceAddress(text: string): ParsedInvoiceAddress | null {
  const lieferstelle = text.match(LIEFERSTELLE_INLINE);
  if (lieferstelle) {
    const { strasse, hausnummer } = splitStreetAndNumber(lieferstelle[1].trim());
    if (strasse.length >= 3) {
      return {
        strasse,
        hausnummer,
        plz: lieferstelle[2],
        ort: lieferstelle[3].trim(),
      };
    }
  }

  const postanschrift = text.match(POSTANSCHRIFT_BLOCK);
  if (postanschrift) {
    const { strasse, hausnummer } = splitStreetAndNumber(postanschrift[1].trim());
    if (strasse.length >= 3) {
      return {
        strasse,
        hausnummer,
        plz: postanschrift[2],
        ort: postanschrift[3].trim(),
      };
    }
  }

  const labeled = text.match(ADDRESS_LABEL);
  if (labeled) {
    const fromLabel = parseAddressFromBlock(labeled[1]);
    if (fromLabel) return fromLabel;
  }

  const lines = text.split(/\n/);
  for (const line of lines) {
    const fromLine = parseAddressFromBlock(line);
    if (fromLine && !PROVIDER_ADDRESS_HINT.test(line)) return fromLine;
  }

  return null;
}

function normalizeIban(value: string): string | undefined {
  const compact = value.replace(/\s/g, "").toUpperCase();
  if (!/^DE\d{20}$/.test(compact)) return undefined;
  return compact;
}

export function parseInvoiceIban(text: string): string | undefined {
  const withoutProviderBank = text.replace(
    /Bankverbindung[\s\S]{0,500}?BIC[^\n]*/i,
    "",
  );

  const labeled = firstMatch(withoutProviderBank, [
    /(?:Ihre|Kunden-)?IBAN[:\s#]*([A-Z]{2}\d{2}(?:\s?\d{4}){4}\s?\d{2})/i,
    /Kontonummer\s*\(IBAN\)[:\s]+([A-Z]{2}\d{2}(?:\s?\d{4}){4}\s?\d{2})/i,
    /SEPA[- ]?Lastschrift[\s\S]{0,200}?IBAN[:\s#]*([A-Z]{2}\d{2}(?:\s?\d{4}){4}\s?\d{2})/i,
  ]);
  if (labeled) return normalizeIban(labeled);

  const matches = [...withoutProviderBank.matchAll(/\b(DE\d{2}(?:\s?\d{4}){4}\s?\d{2})\b/g)];
  for (const match of matches) {
    const iban = normalizeIban(match[1]);
    if (iban) return iban;
  }

  return undefined;
}

export function parseInvoiceKontoinhaber(text: string): string | undefined {
  return firstMatch(text, [
    /Kontoinhaber(?:in)?[:\s]+([^\n]{3,80})/i,
    /Konto[- ]?inhaber[:\s]+([^\n]{3,80})/i,
  ]);
}

export function parseInvoiceText(text: string): InvoiceAnalysis {
  const normalized = normalizeWhitespace(text);
  const lower = normalized.toLowerCase();
  const notizen: string[] = [];

  const energieart = /stromtarif|stromkosten|ökostrom/i.test(normalized)
    ? "strom"
    : /gastarif|gaskosten|erdgas/i.test(normalized)
      ? "gas"
      : lower.includes("strom")
        ? "strom"
        : /\bergas\b|\bgas\b/.test(lower)
          ? "gas"
          : undefined;

  const anbieter = firstMatch(normalized, [
    /(Vattenfall(?:\s+Europe(?:\s+Sales)?)?(?:\s+GmbH)?)/i,
    /(?:Anbieter|Lieferant|Ihr Energieversorger)[:\s]+([^\n]{3,80})/i,
    /(E\.ON|EON|EnBW|RWE|eprimo|LichtBlick|Yello|Maingau|Entega|SW[KL]\s?\w+|Stadtwerke[^\n]{0,40})/i,
  ]);

  const tarif = firstMatch(normalized, [
    /(?:Ihr (?:aktueller )?)?(?:Strom|Gas)tarif\s+([^\n]+)/i,
    /(?:Tarif|Produkt)[:\s]+([^\n]{3,80})/i,
  ]);

  const kundennummerRaw = firstMatch(normalized, [
    /Vertragskonto:\s*([\d\s]{10,20})/i,
    /(?:Kunden(?:nummer|-nr\.?)|Vertragskonto)[:\s#]*([A-Z0-9][A-Z0-9\-\/\s]{4,})/i,
  ]);
  const kundennummer = kundennummerRaw?.replace(/\s+/g, " ").trim();

  const zaehlernummerRaw = firstMatch(normalized, [
    /Z[äa]hlernummer:\s*([^\n]+)/i,
    /(?:Z[äa]hlernummer|Z[äa]hler[- ]?Nr\.?|Messlokation|MaLo)[:\s#]*([A-Z0-9][A-Z0-9\-]{4,})/i,
  ]);
  const zaehlernummer = zaehlernummerRaw?.replace(/\s+/g, " ").trim();

  const rechnungsdatumRaw = firstMatch(normalized, [
    /Rechnungsnummer:[^\n]*vom\s+(\d{1,2}\.\d{1,2}\.\d{4})/i,
    /(?:Rechnungsdatum|Datum der Rechnung|Rechnung vom)[:\s]+([^\n]{6,20})/i,
    /(?:^|\n)Datum\s*\n\s*(\d{1,2}\.\d{1,2}\.\d{4})/i,
  ]);
  const rechnungsdatum = rechnungsdatumRaw ? parseDate(rechnungsdatumRaw) : undefined;

  const zeitraum = firstMatch(normalized, [
    /Rechnung für den\s+(\d{1,2}\.\d{1,2}\.\d{4}\s*[-–]\s*\d{1,2}\.\d{1,2}\.\d{4})/i,
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

  const address = parseInvoiceAddress(normalized);
  const iban = parseInvoiceIban(normalized);
  const kontoinhaber = parseInvoiceKontoinhaber(normalized);

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
    address?.strasse,
    address?.plz,
    iban,
  ].filter(Boolean).length;

  if (foundFields === 0) notizen.push("Keine strukturierten Felder erkannt — Text evtl. gescanntes Bild.");
  if (!anbieter) notizen.push("Anbieter nicht eindeutig erkannt.");
  if (!verbrauchKwh) notizen.push("Verbrauch (kWh) nicht gefunden.");
  if (!address?.plz) notizen.push("Lieferadresse nicht eindeutig erkannt.");
  if (!iban) notizen.push("IBAN nicht gefunden.");

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
    strasse: address?.strasse,
    hausnummer: address?.hausnummer,
    plz: address?.plz,
    ort: address?.ort,
    iban,
    kontoinhaber,
    notizen,
    rawTextPreview: normalized.slice(0, 1500),
  };
}
