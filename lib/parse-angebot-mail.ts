export type ParsedAngebotMail = {
  partner: string;
  name: string;
  email: string;
  telefon: string;
  anmerkungen: string;
  dateiName: string;
  downloadUrl: string | null;
  einwilligungAm: string;
};

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function readTableCell(html: string, label: string): string {
  const pattern = new RegExp(
    `<td[^>]*>\\s*${label}\\s*<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`,
    "i",
  );
  const match = html.match(pattern);
  if (!match) return "";
  return decodeHtml(match[1]);
}

function readEmailAddress(html: string): string {
  const mailto = html.match(/mailto:([^"'>\s]+)/i);
  if (mailto) return decodeHtml(mailto[1]);
  return readTableCell(html, "E-Mail");
}

function readDownloadUrl(html: string): string | null {
  const buttonLink = html.match(
    /<a[^>]+href="([^"]+)"[^>]*>\s*Rechnung herunterladen\s*<\/a>/i,
  );
  if (buttonLink) return decodeHtml(buttonLink[1]);

  const rechnungLink = html.match(/href="([^"]*\/api\/rechnung[^"]*)"/i);
  return rechnungLink ? decodeHtml(rechnungLink[1]) : null;
}

function readPartnerFromSubject(subject: string): string {
  const match = subject.match(/^\[Partner\s+([^\]]+)\]/i);
  return match ? match[1].trim() : "";
}

function readEinwilligung(html: string): string {
  const match = html.match(/Eingang\s+([^<]+)/i);
  return match ? decodeHtml(match[1]) : "";
}

export function parseAngebotMail(subject: string, html: string): ParsedAngebotMail {
  const partner = readPartnerFromSubject(subject);
  const name = readTableCell(html, "Name");
  const email = readEmailAddress(html);
  const telefon = readTableCell(html, "Telefon");
  const anmerkungen = readTableCell(html, "Anmerkungen");
  const dateiRaw = readTableCell(html, "Datei");
  const dateiName = dateiRaw.split("(")[0].trim() || "rechnung.pdf";

  return {
    partner,
    name,
    email,
    telefon: telefon === "–" ? "" : telefon,
    anmerkungen,
    dateiName,
    downloadUrl: readDownloadUrl(html),
    einwilligungAm: readEinwilligung(html),
  };
}

export function matchesPartnerSubject(subject: string, partnerName: string): boolean {
  return subject.trim().toLowerCase().startsWith(`[partner ${partnerName.toLowerCase()}]`);
}
