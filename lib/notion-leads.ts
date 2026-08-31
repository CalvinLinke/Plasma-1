const NOTION_VERSION = "2022-06-28";

type NotionRichText = { type: "text"; text: { content: string } };

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

export async function ensureLeadsDatabase(): Promise<string> {
  const existing = process.env.NOTION_LEADS_DATABASE_ID;
  if (existing) return existing.replace(/-/g, "");

  const res = await notionFetch("/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: parentPageId() },
      title: [{ type: "text", text: { content: "Partner-Anfragen" } }],
      properties: {
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
              { name: "Verarbeitet", color: "gray" },
            ],
          },
        },
        Betreff: { rich_text: {} },
        "Graph-Message-ID": { rich_text: {} },
        "Rechnung-URL": { url: {} },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion-Datenbank anlegen fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string };
  return data.id.replace(/-/g, "");
}

export async function leadExists(databaseId: string, graphMessageId: string): Promise<boolean> {
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

  const data = (await res.json()) as { results?: unknown[] };
  return (data.results?.length ?? 0) > 0;
}

async function uploadFileToNotion(
  filename: string,
  contentType: string,
  bytes: Buffer,
): Promise<{ type: "file_upload"; file_upload: { id: string } } | null> {
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
    file_upload: { id: upload.id },
  };
}

export type LeadInput = {
  graphMessageId: string;
  subject: string;
  partner: string;
  name: string;
  email: string;
  telefon: string;
  anmerkungen: string;
  dateiName: string;
  downloadUrl: string | null;
  receivedDateTime: string;
  invoice?: {
    filename: string;
    contentType: string;
    bytes: Buffer;
  };
};

export async function createLead(databaseId: string, lead: LeadInput): Promise<string> {
  const files: Array<
    | { type: "external"; name: string; external: { url: string } }
    | { type: "file_upload"; file_upload: { id: string } }
  > = [];

  if (lead.invoice) {
    const uploaded = await uploadFileToNotion(
      lead.invoice.filename,
      lead.invoice.contentType,
      lead.invoice.bytes,
    );
    if (uploaded) {
      files.push({ ...uploaded, name: lead.invoice.filename });
    }
  }

  if (files.length === 0 && lead.downloadUrl) {
    files.push({
      type: "external",
      name: lead.dateiName || "Rechnung",
      external: { url: lead.downloadUrl },
    });
  }

  const properties: Record<string, unknown> = {
    Name: {
      title: richText(lead.name || "Unbekannt"),
    },
    Telefon: { rich_text: richText(lead.telefon) },
    Anmerkungen: { rich_text: richText(lead.anmerkungen) },
    Eingang: { date: { start: lead.receivedDateTime.slice(0, 10) } },
    Status: { select: { name: "Neu" } },
    Betreff: { rich_text: richText(lead.subject) },
    "Graph-Message-ID": { rich_text: richText(lead.graphMessageId) },
  };

  if (lead.email) properties["E-Mail"] = { email: lead.email };
  if (lead.partner) properties.Partner = { select: { name: lead.partner } };
  if (files.length) properties.Rechnung = { files };
  if (lead.downloadUrl) properties["Rechnung-URL"] = { url: lead.downloadUrl };

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
