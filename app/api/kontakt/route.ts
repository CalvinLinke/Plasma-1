import { NextRequest, NextResponse } from "next/server";
import { sendMailViaGraph } from "@/lib/graph-mail";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vorname, nachname, email, nachricht, grund, datenschutz } = body;

    // DSGVO-Einwilligung ist Pflicht — ohne aktive Zustimmung keine Verarbeitung (Art. 7 DSGVO).
    if (!datenschutz) {
      return NextResponse.json(
        { success: false, error: "Bitte bestätigen Sie die Datenschutzerklärung." },
        { status: 400 },
      );
    }
    // Zeitpunkt des Eingangs als Nachweis, dass und wann eingewilligt wurde.
    const einwilligungAm = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

    const grundLabel = grund ? `${grund} ` : "";

    // Versand über Microsoft Graph (Client-Credentials) statt SMTP — sendet als
    // box@plasma-energie.de, ohne Benutzer-Login, daher MFA-unabhängig.
    await sendMailViaGraph({
      to: "box@plasma-energie.de",
      replyTo: email,
      subject: `Anfrage ${grundLabel}${vorname} ${nachname}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1A1B4B;">
          <div style="background: linear-gradient(135deg, #4B0082, #1A1B4B); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Neue Kontaktanfrage</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">Plasma Energie Solution — Website</p>
          </div>
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
              ${grund ? `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 0; color: #9CA3AF;">Grund</td>
                <td style="padding: 10px 0;">
                  <span style="display: inline-block; background: rgba(123,97,255,0.12); color: #7B61FF; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px;">${grund}</span>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding: 10px 0; color: #9CA3AF; vertical-align: top;">Nachricht</td>
                <td style="padding: 10px 0;">${(nachricht || "–").replace(/\n/g, "<br>")}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
              <strong style="color: #1A1B4B;">Einwilligung Datenschutz:</strong> erteilt (Opt-in-Checkbox im Formular) · Eingang ${einwilligungAm}
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kontakt-Email-Fehler:", error);
    return NextResponse.json(
      { success: false, error: "E-Mail konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}
