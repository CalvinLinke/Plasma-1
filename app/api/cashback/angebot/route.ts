import { NextResponse } from "next/server";
import { angebotErmitteln, kundenSicht } from "@/lib/cashback/angebot";
import { clientIp, gedrosselt, versiegeln } from "@/lib/cashback/siegel";

export const runtime = "nodejs";
export const maxDuration = 30;

// POST { plz, ort, kwh } → { status, tarif, token }
// Der Token enthält das komplette interne Angebot verschlüsselt.
export async function POST(request: Request) {
  if (gedrosselt(`angebot:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ status: "zuViele" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "ungueltig" }, { status: 400 });
  }

  const plz = String(body.plz ?? "").replace(/\D/g, "");
  const ort = String(body.ort ?? "").trim().slice(0, 60);
  const kwh = Math.round(Number(body.kwh));
  if (!/^\d{5}$/.test(plz) || ort.length < 2 || !Number.isFinite(kwh) || kwh < 500 || kwh > 50000) {
    return NextResponse.json({ status: "ungueltig" }, { status: 400 });
  }

  const ergebnis = await angebotErmitteln({ plz, ort, kwh });
  if (ergebnis.status === "fehler") {
    console.error("[cashback/angebot]", ergebnis.grund);
    return NextResponse.json({ status: "fehler" });
  }
  if (ergebnis.status === "keinTarif") {
    return NextResponse.json({ status: "keinTarif" });
  }

  return NextResponse.json({
    status: "ok",
    demo: ergebnis.angebot.quelle === "demo",
    tarif: kundenSicht(ergebnis.angebot),
    token: await versiegeln(ergebnis.angebot),
  });
}
