import type { InvoiceAnalysis } from "@/lib/invoice-parse";
import type { TariffCheckResult } from "@/lib/neue-energie";

const NOTION_VERSION = "2022-06-28";

type NotionRichText = { type: "text"; text: { content: string } };

const SCHEMA_PATCH_PROPERTIES: Record<string, unknown> = {
  ...{
    Anbieter: { rich_text: {} },
    Energieart: {
      select: {
        options: [
          { name: "Strom", color: "yellow" },
          { name: "Gas", color: "orange" },
        ],
      },
    },
    Tarif: { rich_text: {} },
    Kundennummer: { rich_text: {} },
    "Zählernummer": { rich_text: {} },
    Rechnungsdatum: { date: {} },
    Zeitraum: { rich_text: {} },
    "Verbrauch kWh": { number: { format: "number" } },
    "Arbeitspreis ct/kWh": { number: { format: "number" } },
    "Grundpreis €/Jahr": { number: { format: "number_with_commas" } },
    "Rechnungsbetrag €": { number: { format: "euro" } },
    "Analyse-Status": {
      select: {
        options: [
          { name: "OK", color: "green" },
          { name: "Teilweise", color: "yellow" },
          { name: "Fehlgeschlagen", color: "red" },
          { name: "Bild ohne OCR", color: "gray" },
        ],
      },
    },
    "Analyse-Notizen": { rich_text: {} },
  },
  Vorname: { rich_text: {} },
  Nachname: { rich_text: {} },
  PLZ: { rich_text: {} },
  Ort: { rich_text: {} },
  Straße: { rich_text: {} },
  Hausnummer: { rich_text: {} },
  Anrede: {
    select: {
      options: [
        { name: "Herr", color: "blue" },
        { name: "Frau", color: "pink" },
      ],
    },
  },
  Geburtsdatum: { date: {} },
  IBAN: { rich_text: {} },
  Kontoinhaber: { rich_text: {} },
  Lieferbeginn: { date: {} },
  "Tarif-ID": { rich_text: {} },
  "Tarif-Status": {
    select: {
      options: [
        { name: "OK", color: "green" },
        { name: "Fehlgeschlagen", color: "red" },
        { name: "Übersprungen", color: "gray" },
      ],
    },
  },
  "Angebots-Grundpreis €/Jahr": { number: { format: "number_with_commas" } },
  "Angebots-Arbeitspreis ct/kWh": { number: { format: "number" } },
  "Tarif-Notizen": { rich_text: {} },
};

function notionKey(): string {
  const key = process.env.NOTION_API_KEY;
  if (!key) throw new Error("NOTION_API_KEY fehlt");
  return key;
}

function parentPageId(): string {
  const id = process.env.NOTION_PARENT_PAGE_ID;
  if (!id) {
    throw new Error(
      "NOTION_PARENT_PAGE_ID fehlt — Teamspace-Seite, mit der Integration verbunden ist.",
    );
  }
  return id.replace(/-/g, "");
}

async function notionFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${notionKey()}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

function richText(value: string): NotionRichText[] {
  if (!value) return [];
  return [{ type: "text", text: { content: value.slice(0, 2000) } }];
}

function basePropertyDefs(): Record<string, unknown> {
  return {
    Name: { title: {} },
    "E-Mail": { email: {} },
    Telefon: { rich_text: {} },
    Partner: {
      select: {
        options: [{ name: "tonyM", color: "purple" }],
      },
    },
    Anmerkungen: { rich_text: {} },
    Rechnung: { files: {} },
    Eingang: { date: {} },
    Status: {
      select: {
        options: [
          { name: "Neu", color: "green" },
          { name: "Analysiert", color: "blue" },
          { name: "Tarif geprüft", color: "purple" },
          { name: "Verarbeitet", color: "gray" },
        ],
      },
    },
    Betreff: { rich_text: {} },
    "Graph-Message-ID": { rich_text: {} },
    "Rechnung-URL": { url: {} },
    ...SCHEMA_PATCH_PROPERTIES,
  };
}

async function ensureDatabaseSchema(databaseId: string): Promise<void> {
  const res = await notionFetch(`/databases/${databaseId}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        Status: basePropertyDefs().Status,
        ...SCHEMA_PATCH_PROPERTIES,
      },
    }),
  });

  if (!res.ok) {
    console.warn("Notion-Schema-Update:", await res.text());
  }
}

export async function ensureLeadsDatabase(): Promise<string> {
  const existing = process.env.NOTION_LEADS_DATABASE_ID;
  if (existing) {
    const id = existing.replace(/-/g, "");
    await ensureDatabaseSchema(id);
    return id;
  }

  const res = await notionFetch("/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: parentPageId() },
      title: [{ type: "text", text: { content: "Partner-Anfragen" } }],
      properties: basePropertyDefs(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion-Datenbank anlegen fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string };
  return data.id.replace(/-/g, "");
}

export async function leadExists(databaseId: string, graphMessageId: string): Promise<boolean> {
  return (await findLeadByGraphMessageId(databaseId, graphMessageId)) !== null;
}

export async function findLeadByGraphMessageId(
  databaseId: string,
  graphMessageId: string,
): Promise<{ pageId: string; url?: string } | null> {
  const res = await notionFetch(`/databases/${databaseId}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: {
        property: "Graph-Message-ID",
        rich_text: { equals: graphMessageId },
      },
      page_size: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion-Query fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as {
    results?: Array<{ id: string; url?: string }>;
  };
  const page = data.results?.[0];
  if (!page) return null;
  return { pageId: page.id, url: page.url };
}

async function uploadFileToNotion(
  filename: string,
  contentType: string,
  bytes: Buffer,
): Promise<{ type: "file_upload"; name: string; file_upload: { id: string } } | null> {
  const createRes = await notionFetch("/file_uploads", {
    method: "POST",
    body: JSON.stringify({
      filename,
      content_type: contentType,
    }),
  });

  if (!createRes.ok) {
    console.warn("Notion file_uploads nicht verfügbar:", await createRes.text());
    return null;
  }

  const upload = (await createRes.json()) as {
    id: string;
    upload_url: string;
  };

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(bytes)], { type: contentType }),
    filename,
  );

  const putRes = await fetch(upload.upload_url, {
    method: "POST",
    body: form,
  });

  if (!putRes.ok) {
    console.warn("Notion-Dateiupload fehlgeschlagen:", await putRes.text());
    return null;
  }

  return {
    type: "file_upload",
    name: filename,
    file_upload: { id: upload.id },
  };
}

export type LeadInput = {
  graphMessageId: string;
  subject: string;
  partner: string;
  name: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  anmerkungen: string;
  plz: string;
  ort: string;
  dateiName: string;
  downloadUrl: string | null;
  receivedDateTime: string;
  analysis?: InvoiceAnalysis;
  tariffCheck?: TariffCheckResult;
  invoice?: {
    filename: string;
    contentType: string;
    bytes: Buffer;
  };
};

function analysisStatusLabel(status: InvoiceAnalysis["status"]): string {
  switch (status) {
    case "ok":
      return "OK";
    case "partial":
      return "Teilweise";
    case "image_no_ocr":
      return "Bild ohne OCR";
    default:
      return "Fehlgeschlagen";
  }
}

function energieartLabel(art?: InvoiceAnalysis["energieart"]): string | undefined {
  if (art === "strom") return "Strom";
  if (art === "gas") return "Gas";
  return undefined;
}

async function buildLeadFiles(lead: LeadInput): Promise<
  Array<
    | { type: "external"; name: string; external: { url: string } }
    | { type: "file_upload"; name: string; file_upload: { id: string } }
  >
> {
  const files: Array<
    | { type: "external"; name: string; external: { url: string } }
    | { type: "file_upload"; name: string; file_upload: { id: string } }
  > = [];

  if (lead.invoice) {
    const uploaded = await uploadFileToNotion(
      lead.invoice.filename,
      lead.invoice.contentType,
      lead.invoice.bytes,
    );
    if (uploaded) files.push(uploaded);
  }

  if (files.length === 0 && lead.downloadUrl) {
    files.push({
      type: "external",
      name: lead.dateiName || "Rechnung",
      external: { url: lead.downloadUrl },
    });
  }

  return files;
}

function tariffStatusLabel(status: TariffCheckResult["status"]): string {
  switch (status) {
    case "ok":
      return "OK";
    case "skipped":
      return "Übersprungen";
    default:
      return "Fehlgeschlagen";
  }
}

function resolveLeadStatus(
  analysis: InvoiceAnalysis | undefined,
  tariffCheck: TariffCheckResult | undefined,
): string {
  if (tariffCheck?.status === "ok") return "Tarif geprüft";
  if (analysis && analysis.status !== "failed" && analysis.status !== "image_no_ocr") {
    return "Analysiert";
  }
  return "Neu";
}

function buildLeadProperties(
  lead: LeadInput,
  files: Array<
    | { type: "external"; name: string; external: { url: string } }
    | { type: "file_upload"; name: string; file_upload: { id: string } }
  >,
): Record<string, unknown> {
  const analysis = lead.analysis;
  const tariffCheck = lead.tariffCheck;
  const leadStatus = resolveLeadStatus(analysis, tariffCheck);

  const properties: Record<string, unknown> = {
    Name: {
      title: richText(lead.name || "Unbekannt"),
    },
    Telefon: { rich_text: richText(lead.telefon) },
    Anmerkungen: { rich_text: richText(lead.anmerkungen) },
    Eingang: { date: { start: lead.receivedDateTime.slice(0, 10) } },
    Status: { select: { name: leadStatus } },
    Betreff: { rich_text: richText(lead.subject) },
    "Graph-Message-ID": { rich_text: richText(lead.graphMessageId) },
  };

  if (lead.email) properties["E-Mail"] = { email: lead.email };
  if (lead.partner) properties.Partner = { select: { name: lead.partner } };
  if (lead.vorname) properties.Vorname = { rich_text: richText(lead.vorname) };
  if (lead.nachname) properties.Nachname = { rich_text: richText(lead.nachname) };

  const plz = lead.plz || analysis?.plz || "";
  const ort = lead.ort || analysis?.ort || "";
  if (plz) properties.PLZ = { rich_text: richText(plz) };
  if (ort) properties.Ort = { rich_text: richText(ort) };
  if (analysis?.strasse) properties.Straße = { rich_text: richText(analysis.strasse) };
  if (analysis?.hausnummer) properties.Hausnummer = { rich_text: richText(analysis.hausnummer) };
  if (analysis?.iban) properties.IBAN = { rich_text: richText(analysis.iban) };
  if (analysis?.kontoinhaber) {
    properties.Kontoinhaber = { rich_text: richText(analysis.kontoinhaber) };
  }

  if (files.length) properties.Rechnung = { files };
  if (lead.downloadUrl) properties["Rechnung-URL"] = { url: lead.downloadUrl };

  if (analysis) {
    properties["Analyse-Status"] = { select: { name: analysisStatusLabel(analysis.status) } };
    if (analysis.anbieter) properties.Anbieter = { rich_text: richText(analysis.anbieter) };
    const energie = energieartLabel(analysis.energieart);
    if (energie) properties.Energieart = { select: { name: energie } };
    if (analysis.tarif) properties.Tarif = { rich_text: richText(analysis.tarif) };
    if (analysis.kundennummer) {
      properties.Kundennummer = { rich_text: richText(analysis.kundennummer) };
    }
    if (analysis.zaehlernummer) {
      properties["Zählernummer"] = { rich_text: richText(analysis.zaehlernummer) };
    }
    if (analysis.rechnungsdatum) {
      properties.Rechnungsdatum = { date: { start: analysis.rechnungsdatum } };
    }
    if (analysis.zeitraum) properties.Zeitraum = { rich_text: richText(analysis.zeitraum) };
    if (analysis.verbrauchKwh != null) {
      properties["Verbrauch kWh"] = { number: analysis.verbrauchKwh };
    }
    if (analysis.arbeitspreisCtKwh != null) {
      properties["Arbeitspreis ct/kWh"] = { number: analysis.arbeitspreisCtKwh };
    }
    if (analysis.grundpreisEurJahr != null) {
      properties["Grundpreis €/Jahr"] = { number: analysis.grundpreisEurJahr };
    }
    if (analysis.gesamtbetragEur != null) {
      properties["Rechnungsbetrag €"] = { number: analysis.gesamtbetragEur };
    }
    const notizen = [
      ...analysis.notizen,
      analysis.rawTextPreview ? `Textauszug: ${analysis.rawTextPreview.slice(0, 500)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    if (notizen) properties["Analyse-Notizen"] = { rich_text: richText(notizen) };
  }

  if (tariffCheck) {
    properties["Tarif-Status"] = { select: { name: tariffStatusLabel(tariffCheck.status) } };
    properties["Tarif-ID"] = { rich_text: richText(tariffCheck.tariffId) };
    if (tariffCheck.basePriceEurYear != null) {
      properties["Angebots-Grundpreis €/Jahr"] = { number: tariffCheck.basePriceEurYear };
    }
    if (tariffCheck.workingPriceCtKwh != null) {
      properties["Angebots-Arbeitspreis ct/kWh"] = { number: tariffCheck.workingPriceCtKwh };
    }
    const tariffNotizen = [tariffCheck.errorMessage, tariffCheck.skipReason].filter(Boolean).join("\n");
    if (tariffNotizen) properties["Tarif-Notizen"] = { rich_text: richText(tariffNotizen) };
  }

  return properties;
}

export async function updateLead(pageId: string, lead: LeadInput): Promise<string> {
  const files = await buildLeadFiles(lead);
  const properties = buildLeadProperties(lead, files);

  const res = await notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    throw new Error(`Notion-Seite aktualisieren fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string; url?: string };
  return data.url ?? data.id;
}

export async function createLead(databaseId: string, lead: LeadInput): Promise<string> {
  const files = await buildLeadFiles(lead);
  const properties = buildLeadProperties(lead, files);

  const res = await notionFetch("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion-Seite anlegen fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string; url?: string };
  return data.url ?? data.id;
}
