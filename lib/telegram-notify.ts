export type PartnerLeadTelegramPayload = {
  kind: "created" | "updated";
  name: string;
  partner: string;
  email: string;
  telefon?: string;
  plz?: string;
  ort?: string;
  notionUrl: string;
  analysisStatus?: string;
  tariffSummary?: string;
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function telegramConfig(): { token: string; chatId: string } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return null;
  return { token, chatId };
}

function buildMessage(payload: PartnerLeadTelegramPayload): string {
  const headline = payload.kind === "created" ? "Neue Partner-Anfrage" : "Partner-Anfrage aktualisiert";
  const lines = [
    `<b>${headline}</b>`,
    "",
    `<b>${escapeHtml(payload.name || "Unbekannt")}</b>`,
    payload.partner ? `Partner: ${escapeHtml(payload.partner)}` : "",
    payload.email ? `E-Mail: ${escapeHtml(payload.email)}` : "",
    payload.telefon ? `Telefon: ${escapeHtml(payload.telefon)}` : "",
    payload.plz || payload.ort
      ? `Ort: ${escapeHtml([payload.plz, payload.ort].filter(Boolean).join(" "))}`
      : "",
    payload.analysisStatus ? `Rechnung: ${escapeHtml(payload.analysisStatus)}` : "",
    payload.tariffSummary ? escapeHtml(payload.tariffSummary) : "",
    "",
    `<a href="${payload.notionUrl}">In Notion öffnen</a>`,
  ];

  return lines.filter(Boolean).join("\n");
}

export async function notifyPartnerLeadTelegram(
  payload: PartnerLeadTelegramPayload,
): Promise<{ sent: boolean; skipReason?: string; error?: string }> {
  const cfg = telegramConfig();
  if (!cfg) {
    return { sent: false, skipReason: "TELEGRAM_BOT_TOKEN oder TELEGRAM_CHAT_ID fehlt" };
  }

  if (payload.kind === "updated" && process.env.TELEGRAM_NOTIFY_ON_UPDATE !== "1") {
    return { sent: false, skipReason: "Updates deaktiviert (TELEGRAM_NOTIFY_ON_UPDATE)" };
  }

  const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text: buildMessage(payload),
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { sent: false, error: `Telegram ${res.status}: ${body.slice(0, 200)}` };
  }

  return { sent: true };
}
