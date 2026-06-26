import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

// Gibt dem Browser ein kurzlebiges Token, mit dem er die Datei DIREKT in den
// privaten Blob-Store lädt (umgeht das 4,5-MB-Limit der Serverless-Funktion).
// Hinweis: Ein öffentliches Lead-Formular kann den Uploader nicht "einloggen".
// Schutz gegen Missbrauch = strikte Typ-/Größen-Grenze hier + 30-Tage-Löschung
// (siehe app/api/cleanup/route.ts).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["application/pdf", "image/jpeg", "image/png"],
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
      }),
      // Wird nach Abschluss serverseitig von Vercel aufgerufen (nicht auf localhost).
      // Wir lösen die E-Mail aber über den Folge-POST an /api/angebot aus, daher leer.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
