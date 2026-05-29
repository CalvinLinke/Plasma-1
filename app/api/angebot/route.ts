import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const vorname = (formData.get("vorname") as string) || "";
    const nachname = (formData.get("nachname") as string) || "";
    const email = (formData.get("email") as string) || "";
    const telefon = (formData.get("telefon") as string) || "";
    const anmerkungen = (formData.get("anmerkungen") as string) || "";
    const file = formData.get("file") as File | null;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const attachments: nodemailer.Attachment[] = [];
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type,
      });
    }

    await transporter.sendMail({
      from: `"Plasma Website" <${process.env.SMTP_USER}>`,
      to: "box@plasma-energie.de",
      replyTo: email,
      subject: `Angebot ${vorname} ${nachname}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1A1B4B;">
          <div style="background: linear-gradient(135deg, #4B0082, #1A1B4B); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Neue Angebotsanfrage</h1>
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
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 0; color: #9CA3AF;">Telefon</td>
                <td style="padding: 10px 0;">${telefon || "–"}</td>
              </tr>
              <tr style="${anmerkungen ? "border-bottom: 1px solid #E5E7EB;" : ""}">
                <td style="padding: 10px 0; color: #9CA3AF;">Datei</td>
                <td style="padding: 10px 0;">${file && file.size > 0 ? `${file.name} (${(file.size / 1024).toFixed(0)} KB) — siehe Anhang` : "Keine Datei hochgeladen"}</td>
              </tr>
              ${anmerkungen ? `
              <tr>
                <td style="padding: 10px 0; color: #9CA3AF; vertical-align: top;">Anmerkungen</td>
                <td style="padding: 10px 0;">${anmerkungen.replace(/\n/g, "<br>")}</td>
              </tr>` : ""}
            </table>
          </div>
        </div>
      `,
      attachments,
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
