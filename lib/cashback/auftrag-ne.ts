// Übermittelt einen Cashback-Auftrag an die Neue-Energie-API (POST /contracts).
//
// Ablauf:
// 1. Preisprüfung mit der echten Lieferadresse (checkTariffPrices). Die API
//    kennt die exakten Preise erst mit Adresse und lehnt falsche Preise ab.
// 2. Weicht der Preis vom angezeigten Angebot ab: NICHT senden, manuell prüfen.
// 3. Auftrag mit den echten Kundendaten senden. testMode hängt am
//    CASHBACK_NE_MODUS: "test" = testMode 1 (kein Vertrag), "live" = testMode 0.
//
// Feldnamen nach docs/Antragsformular-Pflichtfelder.md (GFU-Referenz) und
// lib/neue-energie.ts. Offene Punkte stehen in docs/Cashback-Live.md.

import { checkTariffPrices, type TariffCheckInput } from "@/lib/neue-energie";
import type { InternesAngebot } from "@/lib/cashback/angebot";
import type { CashbackPerson } from "@/lib/cashback/pruefung";
import type { NeModus } from "@/lib/cashback/config";

export type NeErgebnis = {
  status: "uebermittelt" | "test-ok" | "uebersprungen" | "preis-abweichung" | "fehler";
  meldung: string;
  auftragsId?: string;
  apiPreise?: { grundpreisEurJahr?: number; arbeitspreisCt?: number };
};

function datumDe(date: Date): string {
  const p = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const teil = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${teil("day")}.${teil("month")}.${teil("year")}`;
}

function isoZuDe(iso: string): string {
  const [j, m, t] = iso.split("-");
  return `${t}.${m}.${j}`;
}

/**
 * Lieferbeginn: Ist der alte Vertrag noch nicht gekündigt, kündigt der neue
 * Versorger und liefert zum nächstmöglichen Termin (Kündigungsfrist des alten
 * Vertrags gilt weiter). Hat der Kunde selbst gekündigt, liefern wir zu seinem
 * Wunschtermin, damit er nicht in die Ersatzversorgung fällt und der neue
 * Versorger nicht ein zweites Mal kündigt.
 */
export function terminAus(person: CashbackPerson): {
  appointment: "appointment_next_possible" | "appointment_exact_date";
  appointmentDate: string;
} {
  if (person.bereitsGekuendigt === "ja" && person.lieferbeginnWunsch) {
    return { appointment: "appointment_exact_date", appointmentDate: isoZuDe(person.lieferbeginnWunsch) };
  }
  return { appointment: "appointment_next_possible", appointmentDate: lieferbeginn() };
}

function lieferbeginn(): string {
  const tage = Number(process.env.NEUE_ENERGIE_APPOINTMENT_DAYS || 14);
  const d = new Date();
  d.setDate(d.getDate() + tage);
  return datumDe(d);
}

/** "0172 1234567" → ["0172", "1234567"], "+49 351 …" → ["0351", …]. */
export function telefonTeilen(telefon: string): [string, string] {
  let ziffern = telefon.replace(/[^\d+]/g, "");
  if (ziffern.startsWith("+49")) ziffern = `0${ziffern.slice(3)}`;
  else if (ziffern.startsWith("0049")) ziffern = `0${ziffern.slice(4)}`;
  ziffern = ziffern.replace(/\D/g, "");
  return [ziffern.slice(0, 4), ziffern.slice(4)];
}

function anredeWert(anrede: CashbackPerson["anrede"]): string {
  return anrede === "Frau"
    ? process.env.NEUE_ENERGIE_SALUTATION_FRAU || "salutation_mrs"
    : "salutation_mr";
}

function auftragFormular(
  angebot: InternesAngebot,
  person: CashbackPerson,
  preise: { basePrice: string; workingPrice: string },
  testMode: "0" | "1",
  vorgang: string,
): FormData {
  const [phoneCode, phone] = telefonTeilen(person.telefon);
  const termin = terminAus(person);
  const felder: Record<string, string> = {
    testMode,
    tariffId: angebot.tariffId,
    type: "type_changing_provider",
    appointment: termin.appointment,
    appointmentDate: termin.appointmentDate,
    priceDate: datumDe(new Date()),
    ref: vorgang,
    externalId: process.env.NEUE_ENERGIE_EXTERNAL_ID || "13120",
    consumption: String(Math.round(angebot.kwh)),
    zip: person.plz,
    city: person.ort,
    street: person.strasse,
    houseNumber: person.hausnummer,
    salutation: anredeWert(person.anrede),
    firstname: person.vorname,
    lastname: person.nachname,
    birthday: isoZuDe(person.geburtstag),
    secondOwner: "false",
    billing: "false",
    accountDelivery: "account_delivery_email",
    email: person.email,
    phoneCode,
    phone,
    meterNumber: person.zaehlernummer.replace(/\s/g, ""),
    currentProviderName: person.vorversorger,
    clientNumber: person.kundennummer,
    individualPayment: "false",
    accountHolder: person.kontoinhaber,
    iban: person.iban,
    privacyAccepted: "true",
    basePrice: preise.basePrice,
    workingPrice: preise.workingPrice,
  };
  if (person.marktlokation) {
    felder.marketLocation = person.marktlokation;
    felder.marketLocationId = person.marktlokation;
  }
  const form = new FormData();
  for (const [k, v] of Object.entries(felder)) form.set(k, v);
  return form;
}

function apiKonfig(): { baseUri: string; apiKey: string } | null {
  const baseUri = process.env.NEUE_ENERGIE_BASE_URI;
  const apiKey = process.env.NEUE_ENERGIE_API_KEY;
  if (!baseUri || !apiKey) return null;
  return { baseUri: baseUri.replace(/\/$/, ""), apiKey };
}

function auftragsIdAus(antwort: Record<string, unknown>): string | undefined {
  const result = antwort.result;
  if (typeof result === "string" || typeof result === "number") return String(result);
  if (result && typeof result === "object") {
    const r = result as Record<string, unknown>;
    const id = r.id ?? r.contractId ?? r.orderId ?? r.number;
    if (typeof id === "string" || typeof id === "number") return String(id);
    return JSON.stringify(r).slice(0, 200);
  }
  return undefined;
}

export async function anNeueEnergieSenden(
  angebot: InternesAngebot,
  person: CashbackPerson,
  modus: NeModus,
  vorgang: string,
): Promise<NeErgebnis> {
  if (angebot.quelle === "demo") {
    return { status: "uebersprungen", meldung: "Demo-Tarif, nichts gesendet" };
  }
  if (modus === "aus") {
    return { status: "uebersprungen", meldung: "Übermittlung ausgeschaltet (CASHBACK_NE_MODUS=aus)" };
  }
  const api = apiKonfig();
  if (!api) return { status: "fehler", meldung: "NEUE_ENERGIE_BASE_URI oder NEUE_ENERGIE_API_KEY fehlt" };

  // 1. Exakte Preise für die echte Adresse holen.
  const termin = terminAus(person);
  const input: TariffCheckInput = {
    street: person.strasse,
    houseNumber: person.hausnummer,
    zip: person.plz,
    city: person.ort,
    consumptionKwh: angebot.kwh,
    appointmentDate: termin.appointmentDate,
    meterNumber: person.zaehlernummer.replace(/\s/g, ""),
    contractType: "type_changing_provider",
    appointment: termin.appointment,
    clientNumber: person.kundennummer || undefined,
    currentProviderName: person.vorversorger,
    marketLocationId: person.marktlokation || undefined,
  };
  const pruefung = await checkTariffPrices(input, angebot.tariffId);
  if (pruefung.status !== "ok" || pruefung.basePriceEurYear === undefined || pruefung.workingPriceCtKwh === undefined) {
    return {
      status: "fehler",
      meldung: `Preisprüfung: ${pruefung.errorMessage || pruefung.skipReason || "keine Preise"}`,
    };
  }
  const apiPreise = { grundpreisEurJahr: pruefung.basePriceEurYear, arbeitspreisCt: pruefung.workingPriceCtKwh };

  // 2. Nur senden, wenn der Kunde genau diesen Preis gesehen hat.
  const abweichung =
    Math.abs(pruefung.workingPriceCtKwh - angebot.arbeitspreisCt) > 0.05 ||
    Math.abs(pruefung.basePriceEurYear - angebot.grundpreisEurJahr) > 1;
  if (abweichung) {
    return {
      status: "preis-abweichung",
      meldung: `API-Preis ${pruefung.workingPriceCtKwh} ct / ${pruefung.basePriceEurYear} € weicht vom Angebot ab (${angebot.arbeitspreisCt} ct / ${angebot.grundpreisEurJahr} €)`,
      apiPreise,
    };
  }

  // 3. Auftrag senden.
  const testMode = modus === "live" ? "0" : "1";
  let antwort: Record<string, unknown>;
  try {
    const res = await fetch(`${api.baseUri}/contracts`, {
      method: "POST",
      headers: { authorization: `Bearer ${api.apiKey}` },
      body: auftragFormular(
        angebot,
        person,
        { basePrice: String(pruefung.basePriceEurYear), workingPrice: String(pruefung.workingPriceCtKwh) },
        testMode,
        vorgang,
      ),
    });
    antwort = (await res.json()) as Record<string, unknown>;
  } catch (error) {
    return { status: "fehler", meldung: error instanceof Error ? error.message : "Netzwerkfehler", apiPreise };
  }

  if (antwort.error === true) {
    return {
      status: "fehler",
      meldung: String(antwort.description ?? `API-Fehler ${String(antwort.code ?? "")}`).slice(0, 500),
      apiPreise,
    };
  }

  return {
    status: modus === "live" ? "uebermittelt" : "test-ok",
    meldung: modus === "live" ? "Auftrag angelegt" : "Testauftrag ohne Fehler (testMode=1, kein Vertrag)",
    auftragsId: auftragsIdAus(antwort),
    apiPreise,
  };
}
