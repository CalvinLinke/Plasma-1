// E-Mails der Cashback-Strecke: Eingangsbestätigung an den Kunden und
// interne Meldung an box@. Die interne Mail ist zugleich die Sicherung,
// falls Notion nicht erreichbar ist (dann mit voller IBAN).

import { sendMailViaGraph } from "@/lib/graph-mail";
import type { InternesAngebot } from "@/lib/cashback/angebot";
import type { CashbackPerson } from "@/lib/cashback/pruefung";
import type { NeErgebnis } from "@/lib/cashback/auftrag-ne";

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const ct = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function rahmen(inhalt: string): string {
  return `<div style="font-family: Arial, sans-serif; color: #1A1B4B; max-width: 600px; line-height: 1.55;">
  <div style="background: linear-gradient(135deg,#4B0082,#1A1B4B); color: #fff; padding: 20px 24px; border-radius: 16px 16px 0 0;">
    <strong style="font-size: 18px;">Plasma Energie Solution</strong>
  </div>
  <div style="border: 1px solid #e6e8ef; border-top: 0; padding: 24px; border-radius: 0 0 16px 16px;">${inhalt}</div>
  <p style="font-size: 12px; color: #8a8fa8; margin-top: 16px;">Plasma Energie Solution · Grüne Straße 13b, 01067 Dresden · +49 172 8182583 · box@plasma-energie.de</p>
</div>`;
}

function zeile(label: string, wert: string): string {
  return `<tr><td style="padding: 6px 12px 6px 0; color: #5c6178;">${esc(label)}</td><td style="padding: 6px 0; font-weight: 600;">${esc(wert)}</td></tr>`;
}

export async function kundenBestaetigung(
  person: CashbackPerson,
  angebot: InternesAngebot,
  vorgang: string,
  betragEur: number,
): Promise<void> {
  const inhalt = `
  <p>Guten Tag ${esc(person.anrede)} ${esc(person.nachname)},</p>
  <p>vielen Dank. Ihr Auftrag für den Stromwechsel ist bei uns eingegangen.</p>
  <table style="border-collapse: collapse; margin: 16px 0;">
    ${zeile("Vorgangsnummer", vorgang)}
    ${zeile("Neuer Versorger", angebot.anbieter)}
    ${zeile("Tarif", angebot.name)}
    ${zeile("Arbeitspreis", `${ct.format(angebot.arbeitspreisCt)} ct/kWh`)}
    ${zeile("Grundpreis", `${euro.format(angebot.grundpreisEurJahr)} pro Jahr`)}
    ${angebot.bonusEur > 0 ? zeile("Bonus des Versorgers", euro.format(angebot.bonusEur)) : ""}
    ${zeile("Berechnet mit", `${angebot.kwh} kWh im Jahr`)}
  </table>
  <p><strong>So geht es weiter:</strong></p>
  <ol style="padding-left: 20px;">
    <li>Wir leiten Ihren Auftrag an ${esc(angebot.anbieter)} weiter.</li>
    <li>${esc(angebot.anbieter)} schickt Ihnen die Vertragsbestätigung per E-Mail. Darin stehen auch die Vertragsbedingungen und Ihr Widerrufsrecht.</li>
    <li>${
      person.bereitsGekuendigt === "ja"
        ? "Sie haben Ihren alten Vertrag selbst gekündigt. Die Belieferung beginnt zu Ihrem Wunschtermin."
        : "Ihren alten Vertrag kündigt der neue Versorger für Sie. Es gilt die Kündigungsfrist Ihres alten Vertrags. Sie müssen nichts tun."
    }</li>
    <li>Sobald Sie beliefert werden, überweisen wir Ihnen ${euro.format(betragEur)} innerhalb von 6 Wochen.</li>
  </ol>
  <p>Fragen? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: 0172 8182583.</p>
  <p>Freundliche Grüße<br/>Ihr Team von Plasma Energie Solution</p>`;

  await sendMailViaGraph({
    to: person.email,
    replyTo: "box@plasma-energie.de",
    subject: `Ihr Stromwechsel mit Plasma: Auftrag ${vorgang} ist eingegangen`,
    html: rahmen(inhalt),
  });
}

export async function interneMeldung(args: {
  an: string;
  person: CashbackPerson;
  angebot: InternesAngebot;
  vorgang: string;
  code: string;
  quelle: string;
  ne: NeErgebnis;
  notionUrl?: string;
  notionFehler?: string;
  duplikat: boolean;
}): Promise<void> {
  const { person: p, angebot: a } = args;
  // IBAN nur dann vollständig, wenn Notion ausgefallen ist (sonst steht sie dort).
  const iban = args.notionFehler ? p.iban : `${p.iban.slice(0, 4)} … ${p.iban.slice(-4)}`;
  const inhalt = `
  <p><strong>Neuer Cashback-Auftrag ${esc(args.vorgang)}</strong> · Code ${esc(args.code)}${args.quelle ? ` · Quelle ${esc(args.quelle)}` : ""}</p>
  ${args.duplikat ? `<p style="color:#b42318;"><strong>Achtung:</strong> Diese Zählernummer gibt es schon. Cashback nur einmal pro Zähler.</p>` : ""}
  ${args.notionFehler ? `<p style="color:#b42318;"><strong>Notion fehlgeschlagen:</strong> ${esc(args.notionFehler)}. Daten bitte von Hand übertragen.</p>` : ""}
  <p>Übermittlung an Neue Energie: <strong>${esc(args.ne.status)}</strong>. ${esc(args.ne.meldung)}${args.ne.auftragsId ? ` (ID ${esc(args.ne.auftragsId)})` : ""}</p>
  <table style="border-collapse: collapse; margin: 16px 0;">
    ${zeile("Name", `${p.anrede} ${p.vorname} ${p.nachname}`)}
    ${zeile("Geburtsdatum", p.geburtstag)}
    ${zeile("E-Mail", p.email)}
    ${zeile("Telefon", p.telefon)}
    ${zeile("Adresse", `${p.strasse} ${p.hausnummer}, ${p.plz} ${p.ort}`)}
    ${zeile("Zählernummer", p.zaehlernummer)}
    ${zeile("Marktlokation", p.marktlokation || "FEHLT, beim Kunden oder Netzbetreiber nachfragen")}
    ${zeile("Kundennummer alt", p.kundennummer)}
    ${zeile("Bisheriger Versorger", p.vorversorger)}
    ${zeile("Alter Vertrag", p.bereitsGekuendigt === "ja" ? `selbst gekündigt, Lieferbeginn gewünscht ${p.lieferbeginnWunsch}` : "noch nicht gekündigt, neuer Versorger kündigt")}
    ${zeile("IBAN", iban)}
    ${zeile("Kontoinhaber", p.kontoinhaber)}
    ${zeile("Tarif", `${a.anbieter} ${a.name} (ID ${a.tariffId})`)}
    ${zeile("Preis", `${ct.format(a.arbeitspreisCt)} ct/kWh · ${euro.format(a.grundpreisEurJahr)}/Jahr · Bonus ${euro.format(a.bonusEur)}`)}
    ${zeile("Verbrauch", `${a.kwh} kWh`)}
    ${zeile("Provision (intern)", euro.format(a.provisionEur))}
  </table>
  ${args.notionUrl ? `<p><a href="${esc(args.notionUrl)}" style="color:#7B61FF;">In Notion öffnen</a></p>` : ""}`;

  await sendMailViaGraph({
    to: args.an,
    replyTo: p.email,
    subject: `Cashback ${args.code}: Auftrag ${args.vorgang} von ${p.vorname} ${p.nachname}${args.duplikat ? " (Duplikat?)" : ""}`,
    html: rahmen(inhalt),
  });
}
