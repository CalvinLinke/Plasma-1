import { NextResponse } from "next/server";
import type { InternesAngebot } from "@/lib/cashback/angebot";
import { anNeueEnergieSenden, type NeErgebnis } from "@/lib/cashback/auftrag-ne";
import { cashbackConfig, normalisiereCode, normalisiereQuelle } from "@/lib/cashback/config";
import { interneMeldung, kundenBestaetigung } from "@/lib/cashback/mails";
import { STATUS, notionBereit, vorgangAktualisieren, vorgangAnlegen, zaehlerBekannt } from "@/lib/cashback/notion";
import { personBereinigen, personPruefen, vertragPruefen, type Zustimmungen } from "@/lib/cashback/pruefung";
import { clientIp, entsiegeln, gedrosselt } from "@/lib/cashback/siegel";
import { notifyPartnerLeadTelegram } from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const maxDuration = 60;

function vorgangsnummer(): string {
  const d = new Date();
  const datum = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const zufall = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32])
    .join("");
  return `CB-${datum}-${zufall}`;
}

function statusAus(ne: NeErgebnis): string {
  if (ne.status === "uebermittelt") return STATUS.uebermittelt;
  if (ne.status === "test-ok") return STATUS.testOk;
  if (ne.status === "uebersprungen") return STATUS.neu;
  return STATUS.manuell;
}

export async function POST(request: Request) {
  if (gedrosselt(`auftrag:${clientIp(request)}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json({ status: "zuViele" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "ungueltig" }, { status: 400 });
  }

  // Honeypot: Bots füllen das unsichtbare Feld aus.
  if (String(body.website ?? "").trim()) {
    return NextResponse.json({ status: "ok", vorgang: "CB-000000-BOT" });
  }

  const angebot = await entsiegeln<InternesAngebot>(String(body.token ?? ""));
  if (!angebot) return NextResponse.json({ status: "abgelaufen" }, { status: 400 });

  const person = personBereinigen(body.person);
  person.plz = angebot.plz; // Preis gilt für diese PLZ
  const z = (body.zustimmungen ?? {}) as Record<string, unknown>;
  const zustimmungen: Zustimmungen = {
    bestellung: z.bestellung === true,
    datenschutz: z.datenschutz === true,
    cashback: z.cashback === true,
  };
  const fehler = { ...personPruefen(person), ...vertragPruefen(person, zustimmungen) };
  if (Object.keys(fehler).length) {
    return NextResponse.json({ status: "ungueltig", fehler }, { status: 400 });
  }

  const cfg = cashbackConfig();
  const code = normalisiereCode(String(body.code ?? ""));
  const quelle = normalisiereQuelle(String(body.quelle ?? ""));
  const sprache = ["de", "uk", "ar", "en"].includes(String(body.sprache)) ? String(body.sprache) : "de";
  const abschlagHeute = Number(body.abschlagHeute);
  const vorgang = vorgangsnummer();
  const modus = angebot.quelle === "demo" ? "demo" : cfg.neModus;

  // 1. Zuerst speichern, damit kein Kunde verloren geht.
  let notionSeite: { pageId: string; url?: string } | null = null;
  let notionFehler: string | undefined;
  let duplikat = false;
  if (notionBereit()) {
    try {
      duplikat = await zaehlerBekannt(person.zaehlernummer.replace(/\s/g, ""));
      notionSeite = await vorgangAnlegen({
        Name: `${person.vorname} ${person.nachname}`,
        Vorgang: vorgang,
        Status: STATUS.neu,
        Code: code,
        Quelle: quelle,
        Sprache: sprache,
        Eingang: new Date().toISOString(),
        "Cashback €": cfg.betragEur,
        "Duplikat-Verdacht": duplikat,
        "E-Mail": person.email,
        Telefon: person.telefon,
        Anrede: person.anrede,
        Geburtsdatum: person.geburtstag,
        Straße: person.strasse,
        Hausnummer: person.hausnummer,
        PLZ: person.plz,
        Ort: person.ort,
        Zählernummer: person.zaehlernummer.replace(/\s/g, ""),
        Marktlokation: person.marktlokation,
        "Kundennummer alt": person.kundennummer,
        "Bisheriger Versorger": person.vorversorger,
        IBAN: person.iban,
        Kontoinhaber: person.kontoinhaber,
        "Neuer Versorger": angebot.anbieter,
        Tarif: angebot.name,
        "Tarif-ID": angebot.tariffId,
        "Verbrauch kWh": angebot.kwh,
        "Arbeitspreis ct/kWh": angebot.arbeitspreisCt,
        "Grundpreis €/Jahr": angebot.grundpreisEurJahr,
        "Bonus €": angebot.bonusEur,
        "Jahreskosten €": angebot.jahreskostenEur,
        "Provision € (intern)": angebot.provisionEur,
        "Abschlag bisher €": Number.isFinite(abschlagHeute) && abschlagHeute > 0 ? abschlagHeute : undefined,
        Übermittlung: modus,
      });
    } catch (error) {
      notionFehler = error instanceof Error ? error.message : "Notion nicht erreichbar";
      console.error("[cashback/auftrag] Notion", notionFehler);
    }
  } else {
    notionFehler = "Notion nicht konfiguriert";
  }

  // 2. An Neue Energie übermitteln (je nach CASHBACK_NE_MODUS).
  let ne: NeErgebnis;
  try {
    ne = await anNeueEnergieSenden(angebot, person, cfg.neModus, vorgang);
  } catch (error) {
    ne = { status: "fehler", meldung: error instanceof Error ? error.message : "Unbekannter Fehler" };
  }

  if (notionSeite) {
    await vorgangAktualisieren(notionSeite.pageId, {
      Status: statusAus(ne),
      "NE-Auftrags-ID": ne.auftragsId,
      "NE-Antwort": `${ne.status}: ${ne.meldung}`,
    }).catch((error) => console.error("[cashback/auftrag] Notion-Update", error));
  }

  // 3. Benachrichtigen. Fehler hier dürfen den Auftrag nicht scheitern lassen.
  const ergebnisse = await Promise.allSettled([
    kundenBestaetigung(person, angebot, vorgang, cfg.betragEur),
    interneMeldung({
      an: cfg.internMail,
      person,
      angebot,
      vorgang,
      code,
      quelle,
      ne,
      notionUrl: notionSeite?.url,
      notionFehler,
      duplikat,
    }),
    notionSeite?.url
      ? notifyPartnerLeadTelegram({
          kind: "created",
          name: `${person.vorname} ${person.nachname}`,
          partner: `Cashback ${code}${quelle ? ` · ${quelle}` : ""}`,
          email: person.email,
          telefon: person.telefon,
          plz: person.plz,
          ort: person.ort,
          notionUrl: notionSeite.url,
          tariffSummary: `${angebot.anbieter} ${angebot.name} · NE: ${ne.status}${duplikat ? " · DUPLIKAT?" : ""}`,
        })
      : Promise.resolve(null),
  ]);
  ergebnisse.forEach((e, i) => {
    if (e.status === "rejected") console.error("[cashback/auftrag] Benachrichtigung", i, e.reason);
  });

  // Wenn weder Notion noch die interne Mail geklappt hat, wäre der Auftrag verloren.
  if (!notionSeite && ergebnisse[1].status === "rejected" && modus !== "demo") {
    return NextResponse.json({ status: "speicherFehler" }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", vorgang });
}
