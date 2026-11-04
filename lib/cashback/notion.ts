// Ablage aller Cashback-Vorgänge in Notion (Datenbank „Cashback-Wechsel“).
// Darüber wird nach Lieferbeginn die 50-€-Auszahlung abgehakt.
// Nutzt dieselbe Integration wie die Partner-Anfragen (NOTION_API_KEY,
// NOTION_PARENT_PAGE_ID). Die Datenbank wird beim ersten Vorgang angelegt.

const NOTION_VERSION = "2022-06-28";
const TITEL = "Cashback-Wechsel";

export const STATUS = {
  neu: "Neu",
  testOk: "Test ok, manuell anlegen",
  uebermittelt: "An Neue Energie übermittelt",
  manuell: "Manuell prüfen",
  belieferung: "Belieferung gestartet",
  ausgezahlt: "Cashback ausgezahlt",
  abgelehnt: "Abgelehnt / storniert",
} as const;

function konfig(): { key: string; parent: string } | null {
  const key = process.env.NOTION_API_KEY;
  const parent = process.env.NOTION_PARENT_PAGE_ID;
  if (!key || !parent) return null;
  return { key, parent: parent.replace(/-/g, "") };
}

async function notion(path: string, init: RequestInit = {}): Promise<Response> {
  const cfg = konfig();
  if (!cfg) throw new Error("NOTION_API_KEY oder NOTION_PARENT_PAGE_ID fehlt");
  return fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
  });
}

const tx = { rich_text: {} };
const sel = (namen: string[]) => ({ select: { options: namen.map((name) => ({ name })) } });

function schema(): Record<string, unknown> {
  return {
    Name: { title: {} },
    Vorgang: tx,
    Status: sel(Object.values(STATUS)),
    Code: sel(["DRESDEN50"]),
    Quelle: tx,
    Sprache: sel(["de", "uk", "ar", "en"]),
    Eingang: { date: {} },
    "Cashback €": { number: { format: "euro" } },
    Lieferbeginn: { date: {} },
    "Cashback ausgezahlt am": { date: {} },
    "Duplikat-Verdacht": { checkbox: {} },
    "E-Mail": { email: {} },
    Telefon: { phone_number: {} },
    Anrede: sel(["Frau", "Herr"]),
    Geburtsdatum: { date: {} },
    Straße: tx,
    Hausnummer: tx,
    PLZ: tx,
    Ort: tx,
    Zählernummer: tx,
    Marktlokation: tx,
    "Kundennummer alt": tx,
    "Bisheriger Versorger": tx,
    IBAN: tx,
    Kontoinhaber: tx,
    "Neuer Versorger": tx,
    Tarif: tx,
    "Tarif-ID": tx,
    "Verbrauch kWh": { number: { format: "number" } },
    "Arbeitspreis ct/kWh": { number: { format: "number" } },
    "Grundpreis €/Jahr": { number: { format: "euro" } },
    "Bonus €": { number: { format: "euro" } },
    "Jahreskosten €": { number: { format: "euro" } },
    "Provision € (intern)": { number: { format: "euro" } },
    "Abschlag bisher €": { number: { format: "euro" } },
    Übermittlung: sel(["aus", "test", "live", "demo"]),
    "NE-Auftrags-ID": tx,
    "NE-Antwort": tx,
  };
}

let datenbankId: string | null = process.env.CASHBACK_NOTION_DATABASE_ID?.replace(/-/g, "") || null;

async function datenbank(): Promise<string> {
  if (datenbankId) return datenbankId;

  // Bereits angelegt? Über die Suche finden, damit keine Dubletten entstehen.
  const suche = await notion("/search", {
    method: "POST",
    body: JSON.stringify({ query: TITEL, filter: { property: "object", value: "database" }, page_size: 10 }),
  });
  if (suche.ok) {
    const daten = (await suche.json()) as { results?: Array<{ id: string; title?: Array<{ plain_text?: string }> }> };
    const treffer = daten.results?.find((r) => r.title?.map((t) => t.plain_text).join("") === TITEL);
    if (treffer) {
      datenbankId = treffer.id.replace(/-/g, "");
      return datenbankId;
    }
  }

  const res = await notion("/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: konfig()!.parent },
      title: [{ type: "text", text: { content: TITEL } }],
      properties: schema(),
    }),
  });
  if (!res.ok) throw new Error(`Notion-Datenbank anlegen fehlgeschlagen (${res.status}): ${await res.text()}`);
  datenbankId = ((await res.json()) as { id: string }).id.replace(/-/g, "");
  return datenbankId;
}

type Wert = string | number | boolean | null | undefined;

function eigenschaft(name: string, wert: Wert): unknown {
  const def = schema()[name] as Record<string, unknown> | undefined;
  if (!def || wert === undefined || wert === null || wert === "") return undefined;
  if ("title" in def) return { title: [{ text: { content: String(wert).slice(0, 200) } }] };
  if ("rich_text" in def) return { rich_text: [{ text: { content: String(wert).slice(0, 1900) } }] };
  if ("select" in def) return { select: { name: String(wert).slice(0, 90) } };
  if ("number" in def) return typeof wert === "number" && Number.isFinite(wert) ? { number: wert } : undefined;
  if ("date" in def) return { date: { start: String(wert) } };
  if ("email" in def) return { email: String(wert) };
  if ("phone_number" in def) return { phone_number: String(wert) };
  if ("checkbox" in def) return { checkbox: Boolean(wert) };
  return undefined;
}

function eigenschaften(werte: Record<string, Wert>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, wert] of Object.entries(werte)) {
    const e = eigenschaft(name, wert);
    if (e !== undefined) out[name] = e;
  }
  return out;
}

let schemaGeprueft = false;

/**
 * Legt nur Spalten an, die in Notion fehlen. Bestehende Spalten (und deren
 * Auswahl-Optionen, die Calvin evtl. ergänzt hat) bleiben unangetastet.
 */
async function fehlendeSpaltenAnlegen(id: string): Promise<void> {
  if (schemaGeprueft) return;
  const res = await notion(`/databases/${id}`);
  if (!res.ok) return;
  const vorhanden = ((await res.json()) as { properties?: Record<string, unknown> }).properties ?? {};
  const fehlend = Object.fromEntries(Object.entries(schema()).filter(([name]) => !(name in vorhanden)));
  if (Object.keys(fehlend).length) {
    await notion(`/databases/${id}`, { method: "PATCH", body: JSON.stringify({ properties: fehlend }) });
  }
  schemaGeprueft = true;
}

export function notionBereit(): boolean {
  return konfig() !== null;
}

/** Gibt es diesen Zähler schon? Dann Duplikat-Verdacht (einmal pro Zähler). */
export async function zaehlerBekannt(zaehlernummer: string): Promise<boolean> {
  const id = await datenbank();
  const res = await notion(`/databases/${id}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: { property: "Zählernummer", rich_text: { equals: zaehlernummer } },
      page_size: 1,
    }),
  });
  if (!res.ok) return false;
  const daten = (await res.json()) as { results?: unknown[] };
  return (daten.results?.length ?? 0) > 0;
}

export async function vorgangAnlegen(werte: Record<string, Wert>): Promise<{ pageId: string; url?: string }> {
  const id = await datenbank();
  await fehlendeSpaltenAnlegen(id).catch(() => undefined);
  const res = await notion("/pages", {
    method: "POST",
    body: JSON.stringify({ parent: { database_id: id }, properties: eigenschaften(werte) }),
  });
  if (!res.ok) throw new Error(`Notion-Eintrag fehlgeschlagen (${res.status}): ${await res.text()}`);
  const page = (await res.json()) as { id: string; url?: string };
  return { pageId: page.id, url: page.url };
}

export async function vorgangAktualisieren(pageId: string, werte: Record<string, Wert>): Promise<void> {
  const res = await notion(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: eigenschaften(werte) }),
  });
  if (!res.ok) throw new Error(`Notion-Update fehlgeschlagen (${res.status}): ${await res.text()}`);
}
