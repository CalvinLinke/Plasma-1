export type ParsedContactFields = {
  vorname: string;
  nachname: string;
  plz: string;
  ort: string;
};

export function splitName(fullName: string): { vorname: string; nachname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { vorname: "", nachname: "" };
  if (parts.length === 1) return { vorname: parts[0], nachname: "" };
  return { vorname: parts[0], nachname: parts.slice(1).join(" ") };
}

export function parsePlzOrt(text: string): { plz: string; ort: string } {
  const labeled = text.match(/PLZ\s*\/?\s*Wohnort:\s*(\d{5})\s+([^\n,;]+)/i);
  if (labeled) {
    return { plz: labeled[1], ort: labeled[2].trim() };
  }

  const inline = text.match(/\b(\d{5})\s+([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\s.-]{1,40})/);
  if (inline) {
    return { plz: inline[1], ort: inline[2].trim() };
  }

  return { plz: "", ort: "" };
}

export function parseContactFields(name: string, anmerkungen: string): ParsedContactFields {
  const { vorname, nachname } = splitName(name);
  const { plz, ort } = parsePlzOrt(anmerkungen);
  return { vorname, nachname, plz, ort };
}
