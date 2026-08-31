import { NextRequest, NextResponse } from "next/server";
import { notifyPartnerLeadTelegram } from "@/lib/telegram-notify";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }
  return process.env.NODE_ENV === "development";
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await notifyPartnerLeadTelegram({
    kind: "created",
    name: "Test Lead",
    partner: "tonyM",
    email: "test@plasma-energie.de",
    telefon: "+49 172 8182583",
    plz: "01067",
    ort: "Dresden",
    notionUrl: "https://www.notion.so",
    analysisStatus: "ok",
    tariffSummary: "Test-Nachricht — Telegram funktioniert.",
  });

  return NextResponse.json(result);
}
