import { NextRequest, NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 Tage

// Täglich per Vercel Cron aufgerufen (vercel.json). Löscht hochgeladene
// Rechnungen, die älter als 30 Tage sind — Datenschutz. Vercel sendet bei
// Cron-Aufrufen automatisch "Authorization: Bearer <CRON_SECRET>".
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = Date.now();
  let deleted = 0;
  let cursor: string | undefined;

  do {
    const res = await list({ cursor, limit: 1000 });
    const expired = res.blobs.filter(
      (b) => now - new Date(b.uploadedAt).getTime() > MAX_AGE_MS,
    );
    if (expired.length > 0) {
      await del(expired.map((b) => b.url));
      deleted += expired.length;
    }
    cursor = res.cursor;
  } while (cursor);

  return NextResponse.json({ deleted });
}
