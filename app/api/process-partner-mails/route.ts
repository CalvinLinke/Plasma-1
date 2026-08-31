import { NextRequest, NextResponse } from "next/server";
import { processPartnerMails } from "@/lib/process-partner-mails";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }

  // Lokaler Test ohne Secret — nur in Development.
  return process.env.NODE_ENV === "development";
}

// Manuell oder per Cron: ungelesene [Partner tonyM]-Mails verarbeiten.
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
  const debug = request.nextUrl.searchParams.get("debug") === "1";
  const partner = request.nextUrl.searchParams.get("partner") || "tonyM";
  const lookbackRaw = request.nextUrl.searchParams.get("lookbackMinutes");
  const lookbackMinutes = lookbackRaw ? Number(lookbackRaw) : undefined;

  try {
    const result = await processPartnerMails({
      partnerName: partner,
      dryRun,
      debug,
      lookbackMinutes: Number.isFinite(lookbackMinutes) ? lookbackMinutes : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("process-partner-mails:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Verarbeitung fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}
