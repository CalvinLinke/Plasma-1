import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { verifyPathname } from "@/lib/blob-download";

export const runtime = "nodejs";

// Geschützter Download für private Rechnungen. Der Link aus der E-Mail trägt
// eine HMAC-Signatur (siehe lib/blob-download.ts); ohne gültige Signatur kein
// Zugriff. Die Datei wird serverseitig aus dem privaten Store geholt und gestreamt —
// die private Blob-URL selbst ist von außen nicht abrufbar.
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");
  const sig = request.nextUrl.searchParams.get("sig");

  if (!pathname || !sig || !verifyPathname(pathname, sig)) {
    return new NextResponse("Zugriff verweigert.", { status: 403 });
  }

  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200) {
      return new NextResponse("Datei nicht gefunden.", { status: 404 });
    }

    const filename = pathname.split("/").pop() || "rechnung";
    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Rechnung-Download-Fehler:", error);
    return new NextResponse("Datei nicht verfügbar.", { status: 404 });
  }
}
