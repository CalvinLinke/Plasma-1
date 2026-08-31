import { analyzeInvoice } from "@/lib/analyze-invoice";
import { listRecentMessages } from "@/lib/graph-inbox";
import {
  createLead,
  ensureLeadsDatabase,
  findLeadByGraphMessageId,
  updateLead,
  type LeadInput,
} from "@/lib/notion-leads";
import { matchesPartnerSubject, parseAngebotMail } from "@/lib/parse-angebot-mail";

export type ProcessPartnerMailsOptions = {
  partnerName?: string;
  dryRun?: boolean;
  debug?: boolean;
  lookbackMinutes?: number;
  updateExisting?: boolean;
};

export type ProcessPartnerMailsResult = {
  scanned: number;
  matched: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  databaseId?: string;
  debugSubjects?: string[];
  items: Array<{
    subject: string;
    status: "created" | "updated" | "skipped" | "error" | "dry-run";
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
    updated: 0,
    skipped: 0,
    errors: [],
    items: [],
  };

  const messages = await listRecentMessages(
    options.lookbackMinutes ??
      Number(process.env.PARTNER_MAIL_LOOKBACK_MINUTES || 15),
  );
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
      const existingLead =
        !dryRun && databaseId
          ? await findLeadByGraphMessageId(databaseId, message.id)
          : null;

      if (existingLead && !options.updateExisting) {
        result.skipped += 1;
        result.items.push({
          subject: message.subject,
          status: "skipped",
          message: "Bereits bekannt",
          notionUrl: existingLead.url,
        });
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
          message: `${parsed.name} · ${parsed.email}${invoice ? ` · Analyse: ${analysis?.status ?? "—"}` : ""}${existingLead ? " · Update" : ""}`,
        });
        continue;
      }

      if (!databaseId) throw new Error("Notion-Datenbank-ID fehlt");

      const leadInput: LeadInput = {
        graphMessageId: message.id,
        subject: message.subject,
        partner: parsed.partner,
        name: parsed.name,
        vorname: parsed.vorname,
        nachname: parsed.nachname,
        email: parsed.email,
        telefon: parsed.telefon,
        anmerkungen: parsed.anmerkungen,
        plz: parsed.plz,
        ort: parsed.ort,
        dateiName: parsed.dateiName,
        downloadUrl: parsed.downloadUrl,
        receivedDateTime: message.receivedDateTime,
        invoice,
        analysis,
      };

      if (existingLead) {
        const notionUrl = await updateLead(existingLead.pageId, leadInput);
        result.updated += 1;
        result.items.push({
          subject: message.subject,
          status: "updated",
          notionUrl,
          message: analysis ? `Analyse: ${analysis.status}` : undefined,
        });
        continue;
      }

      const notionUrl = await createLead(databaseId, leadInput);

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
