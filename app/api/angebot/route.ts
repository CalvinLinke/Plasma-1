import { NextRequest, NextResponse } from "next/server";
import { sendMailViaGraph } from "@/lib/graph-mail";
import { getPartner } from "@/lib/partners";
import { buildDownloadUrl } from "@/lib/blob-download";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // DSGVO-Einwilligung ist Pflicht — ohne aktive Zustimmung keine Verarbeitung (Art. 7 DSGVO).
    if (formData.get("datenschutz") !== "on") {
      return NextResponse.json(
        { success: false, error: "Bitte bestätigen Sie die Datenschutzerklärung." },
        { status: 400 },
      );
    }
    // Zeitpunkt des Eingangs als Nachweis, dass und wann eingewilligt wurde.
    const einwilligungAm = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

    const vorname = (formData.get("vorname") as string) || "";
    const nachname = (formData.get("nachname") as string) || "";
    const email = (formData.get("email") as string) || "";
    const telefon = (formData.get("telefon") as string) || "";
    const anmerkungen = (formData.get("anmerkungen") as string) || "";

    // Die Datei liegt bereits im privaten Blob-Store (Direkt-Upload vom Browser).
    // Hier kommt nur noch der Pfad an — kein großer Request, kein 4,5-MB-Limit.
    const filePathname = (formData.get("filePathname") as string) || "";
    const fileName = (formData.get("fileName") as string) || "";
    const fileSize = parseInt((formData.get("fileSize") as string) || "0", 10);
    const hasFile = filePathname.length > 0;
    const sizeLabel = fileSize > 1024 * 1024
      ? `${(fileSize / 1024 / 1024).toFixed(1)} MB`
      : `${Math.max(1, Math.round(fileSize / 1024))} KB`;
    const downloadUrl = hasFile
      ? buildDownloadUrl(request.nextUrl.origin, filePathname)
      : null;

    // Provisionszuordnung: zuerst das Formular-Feld (aktuelle Absicht der
    // Partner-Seite), dann der Cookie (älterer Erstkontakt) als Fallback.
    // Der Name stammt immer aus der Registry — nie aus rohem User-Input.
    const partnerSlug =
      (formData.get("partner") as string) ||
      request.cookies.get("plasma_partner")?.value ||
      "";
    const partner = getPartner(partnerSlug);

    // Versand über Microsoft Graph (Client-Credentials) statt SMTP — die App
    // sendet als box@plasma-energie.de, ohne Benutzer-Login, daher MFA-unabhängig.
    await sendMailViaGraph({
      to: "box@plasma-energie.de",
      replyTo: email,
      subject: partner
        ? `[Partner ${partner.name}] Angebot ${vorname} ${nachname}`
        : `Angebot ${vorname} ${nachname}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1A1B4B;">
          <div style="background: linear-gradient(135deg, #4B0082, #1A1B4B); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Neue Angebotsanfrage</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">Plasma Energie Solution — Website</p>
          </div>
          ${partner ? `
          <div style="background: #7B61FF; padding: 12px 32px; color: white; font-size: 14px;">
            <strong>Vermittelt durch: ${partner.name}</strong>
            <span style="color: rgba(255,255,255,0.7);"> — Provisionszuordnung</span>
          </div>` : ""}
          <div style="background: #F8FAFC; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB; border-top: none;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 0; color: #9CA3AF; width: 140px;">Name</td>
                <td style="padding: 10px 0; font-weight: 600;">${vorname} ${nachname}</td>
              </tr>
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 0; color: #9CA3AF;">E-Mail</td>
                <td style="padding: 10px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #7B61FF;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 0; color: #9CA3AF;">Telefon</td>
                <td style="padding: 10px 0;">${telefon || "–"}</td>
              </tr>
              <tr style="${anmerkungen ? "border-bottom: 1px solid #E5E7EB;" : ""}">
                <td style="padding: 10px 0; color: #9CA3AF;">Datei</td>
                <td style="padding: 10px 0;">${hasFile ? `${fileName} (${sizeLabel})` : "Keine Datei hochgeladen"}</td>
              </tr>
              ${anmerkungen ? `
              <tr>
                <td style="padding: 10px 0; color: #9CA3AF; vertical-align: top;">Anmerkungen</td>
                <td style="padding: 10px 0;">${anmerkungen.replace(/\n/g, "<br>")}</td>
              </tr>` : ""}
            </table>
            ${hasFile ? (downloadUrl ? `
            <div style="margin-top: 24px; text-align: center;">
              <a href="${downloadUrl}" style="display: inline-block; background: #7B61FF; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Rechnung herunterladen</a>
              <p style="color: #9CA3AF; font-size: 12px; margin: 12px 0 0;">Link 90 Tage gültig · danach wird die Datei automatisch gelöscht.</p>
            </div>` : `
            <div style="margin-top: 24px; padding: 12px 16px; background: #FEF3C7; border-radius: 8px; font-size: 13px; color: #92400E;">
              Datei liegt im Blob-Store unter <strong>${fileName}</strong> (Pfad: ${filePathname}). Download-Link nicht verfügbar — bitte DOWNLOAD_SECRET prüfen.
            </div>`) : ""}
            <p style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
              <strong style="color: #1A1B4B;">Einwilligung Datenschutz:</strong> erteilt (Opt-in-Checkbox im Formular) · Eingang ${einwilligungAm}
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Angebot-Email-Fehler:", error);
    return NextResponse.json(
      { success: false, error: "E-Mail konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}
