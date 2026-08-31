import { analyzeInvoice } from "@/lib/analyze-invoice";
import { listUnreadMessages, markMessageAsRead } from "@/lib/graph-inbox";
import {
  createLead,
  ensureLeadsDatabase,
  leadExists,
  type LeadInput,
} from "@/lib/notion-leads";
import { matchesPartnerSubject, parseAngebotMail } from "@/lib/parse-angebot-mail";

export type ProcessPartnerMailsOptions = {
  partnerName?: string;
  dryRun?: boolean;
  debug?: boolean;
};

export type ProcessPartnerMailsResult = {
  scanned: number;
  matched: number;
  created: number;
  skipped: number;
  errors: string[];
  databaseId?: string;
  debugSubjects?: string[];
  items: Array<{
    subject: string;
    status: "created" | "skipped" | "error" | "dry-run";
    notionUrl?: string;
    message?: string;
  }>;
};

async function downloadInvoice(url: string): Promise<{
  filename: string;
  contentType: string;
  bytes: Buffer;
} | null> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Rechnung-Download fehlgeschlagen (${res.status})`);
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const fromHeader = res.headers.get("content-disposition")?.match(/filename="?([^"]+)"?/i);
  const filename = fromHeader?.[1] || "rechnung.pdf";

  return { filename, contentType, bytes };
}

export async function processPartnerMails(
  options: ProcessPartnerMailsOptions = {},
): Promise<ProcessPartnerMailsResult> {
  const partnerName = options.partnerName ?? "tonyM";
  const dryRun = options.dryRun ?? false;

  const result: ProcessPartnerMailsResult = {
    scanned: 0,
    matched: 0,
    created: 0,
    skipped: 0,
    errors: [],
    items: [],
  };

  const messages = await listUnreadMessages();
  result.scanned = messages.length;
  if (options.debug) {
    result.debugSubjects = messages.map((message) => message.subject);
  }

  const databaseId = dryRun ? undefined : await ensureLeadsDatabase();
  result.databaseId = databaseId;

  for (const message of messages) {
    if (!matchesPartnerSubject(message.subject, partnerName)) continue;
    result.matched += 1;

    try {
      const parsed = parseAngebotMail(message.subject, message.bodyHtml);

      if (!dryRun && databaseId && (await leadExists(databaseId, message.id))) {
        result.skipped += 1;
        result.items.push({
          subject: message.subject,
          status: "skipped",
          message: "Bereits in Notion vorhanden",
        });
        await markMessageAsRead(message.id);
        continue;
      }

      let invoice: LeadInput["invoice"];
      if (parsed.downloadUrl) {
        try {
          invoice = (await downloadInvoice(parsed.downloadUrl)) ?? undefined;
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Rechnung-Download fehlgeschlagen";
          result.errors.push(`${message.subject}: ${msg}`);
        }
      }

      const analysis = invoice ? await analyzeInvoice(invoice) : undefined;

      if (dryRun) {
        result.items.push({
          subject: message.subject,
          status: "dry-run",
          message: `${parsed.name} · ${parsed.email}${invoice ? ` · Analyse: ${analysis?.status ?? "—"}` : ""}`,
        });
        continue;
      }

      if (!databaseId) throw new Error("Notion-Datenbank-ID fehlt");

      const notionUrl = await createLead(databaseId, {
        graphMessageId: message.id,
        subject: message.subject,
        partner: parsed.partner,
        name: parsed.name,
        email: parsed.email,
        telefon: parsed.telefon,
        anmerkungen: parsed.anmerkungen,
        dateiName: parsed.dateiName,
        downloadUrl: parsed.downloadUrl,
        receivedDateTime: message.receivedDateTime,
        invoice,
        analysis,
      });

      await markMessageAsRead(message.id);
      result.created += 1;
      result.items.push({
        subject: message.subject,
        status: "created",
        notionUrl,
        message: analysis ? `Analyse: ${analysis.status}` : undefined,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unbekannter Fehler";
      result.errors.push(`${message.subject}: ${msg}`);
      result.items.push({
        subject: message.subject,
        status: "error",
        message: msg,
      });
    }
  }

  return result;
}
