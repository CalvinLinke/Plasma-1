// Eingabeprüfung, gemeinsam für Browser und Server.

export type CashbackPerson = {
  anrede: "Frau" | "Herr" | "";
  vorname: string;
  nachname: string;
  geburtstag: string; // ISO yyyy-mm-dd
  email: string;
  telefon: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  zaehlernummer: string;
  marktlokation: string;
  kundennummer: string;
  vorversorger: string;
  /** Jahresverbrauch laut letzter Rechnung (kWh, als Text aus dem Feld). */
  verbrauchRechnung: string;
  /** Hat der Kunde den alten Vertrag schon selbst gekündigt? */
  bereitsGekuendigt: "ja" | "nein" | "";
  /** Nur bei bereitsGekuendigt = ja: gewünschter Lieferbeginn (ISO). */
  lieferbeginnWunsch: string;
  /** Kunde findet die MaLo-ID nicht. Wechsel geht dann über Zähler + Adresse, langsamer. */
  maloUnbekannt: boolean;
  iban: string;
  kontoinhaber: string;
};

export type Zustimmungen = {
  bestellung: boolean;
  datenschutz: boolean;
  cashback: boolean;
};

export type CashbackFehler =
  | "plz"
  | "ort"
  | "verbrauch"
  | "anrede"
  | "vorname"
  | "nachname"
  | "geburtstag"
  | "volljaehrig"
  | "email"
  | "telefon"
  | "strasse"
  | "hausnummer"
  | "zaehlernummer"
  | "marktlokation"
  | "kundennummer"
  | "verbrauchRechnung"
  | "bereitsGekuendigt"
  | "lieferbeginnWunsch"
  | "vorversorger"
  | "iban"
  | "ibanPruefziffer"
  | "kontoinhaber"
  | "bestellung"
  | "datenschutz"
  | "cashback";

export const LEERE_PERSON: CashbackPerson = {
  anrede: "",
  vorname: "",
  nachname: "",
  geburtstag: "",
  email: "",
  telefon: "",
  strasse: "",
  hausnummer: "",
  plz: "",
  ort: "",
  zaehlernummer: "",
  marktlokation: "",
  kundennummer: "",
  vorversorger: "",
  verbrauchRechnung: "",
  bereitsGekuendigt: "",
  lieferbeginnWunsch: "",
  maloUnbekannt: false,
  iban: "",
  kontoinhaber: "",
};

export function ibanNormal(iban: string): string {
  return iban.replace(/\s/g, "").toUpperCase();
}

/** Prüfziffer nach ISO 13616 (mod 97). */
export function ibanGueltig(iban: string): boolean {
  const wert = ibanNormal(iban);
  if (!/^DE\d{20}$/.test(wert)) return false;
  const umgestellt = wert.slice(4) + wert.slice(0, 4);
  const ziffern = umgestellt.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rest = 0;
  for (const ziffer of ziffern) rest = (rest * 10 + Number(ziffer)) % 97;
  return rest === 1;
}

export function volljaehrig(iso: string): boolean {
  const geboren = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(geboren.getTime())) return false;
  const grenze = new Date();
  grenze.setFullYear(grenze.getFullYear() - 18);
  const alt = new Date();
  alt.setFullYear(alt.getFullYear() - 110);
  return geboren <= grenze && geboren >= alt;
}

export type Fehlerliste = Partial<Record<keyof CashbackPerson | keyof Zustimmungen, CashbackFehler>>;

export function kwhAusText(text: string): number {
  const n = Number(text.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

/** Lieferbeginn-Wunsch: frühestens morgen, höchstens 12 Monate im Voraus. */
export function lieferbeginnGueltig(iso: string): boolean {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const morgen = new Date();
  morgen.setHours(0, 0, 0, 0);
  morgen.setDate(morgen.getDate() + 1);
  const spaetestens = new Date(morgen);
  spaetestens.setFullYear(spaetestens.getFullYear() + 1);
  return d >= morgen && d <= spaetestens;
}

export function personPruefen(p: CashbackPerson): Fehlerliste {
  const f: Fehlerliste = {};
  if (p.anrede !== "Frau" && p.anrede !== "Herr") f.anrede = "anrede";
  if (p.vorname.trim().length < 2) f.vorname = "vorname";
  if (p.nachname.trim().length < 2) f.nachname = "nachname";
  if (!p.geburtstag) f.geburtstag = "geburtstag";
  else if (!volljaehrig(p.geburtstag)) f.geburtstag = "volljaehrig";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim())) f.email = "email";
  if (p.telefon.replace(/\D/g, "").length < 6) f.telefon = "telefon";
  if (p.strasse.trim().length < 2) f.strasse = "strasse";
  if (!p.hausnummer.trim()) f.hausnummer = "hausnummer";
  if (!/^\d{5}$/.test(p.plz)) f.plz = "plz";
  if (p.ort.trim().length < 2) f.ort = "ort";
  return f;
}

export function vertragPruefen(p: CashbackPerson, z: Zustimmungen): Fehlerliste {
  const f: Fehlerliste = {};
  if (p.zaehlernummer.replace(/\s/g, "").length < 4) f.zaehlernummer = "zaehlernummer";
  const malo = p.marktlokation.replace(/\s/g, "");
  if (malo ? !/^\d{11}$/.test(malo) : !p.maloUnbekannt) f.marktlokation = "marktlokation";
  if (p.kundennummer.replace(/\s/g, "").length < 3) f.kundennummer = "kundennummer";
  if (p.vorversorger.trim().length < 3) f.vorversorger = "vorversorger";
  const kwh = kwhAusText(p.verbrauchRechnung);
  if (kwh < 300 || kwh > 50000) f.verbrauchRechnung = "verbrauchRechnung";
  if (p.bereitsGekuendigt !== "ja" && p.bereitsGekuendigt !== "nein") f.bereitsGekuendigt = "bereitsGekuendigt";
  if (p.bereitsGekuendigt === "ja" && !lieferbeginnGueltig(p.lieferbeginnWunsch)) f.lieferbeginnWunsch = "lieferbeginnWunsch";
  const iban = ibanNormal(p.iban);
  if (!/^DE\d{20}$/.test(iban)) f.iban = "iban";
  else if (!ibanGueltig(iban)) f.iban = "ibanPruefziffer";
  if (p.kontoinhaber.trim().length < 3) f.kontoinhaber = "kontoinhaber";
  if (!z.bestellung) f.bestellung = "bestellung";
  if (!z.datenschutz) f.datenschutz = "datenschutz";
  if (!z.cashback) f.cashback = "cashback";
  return f;
}

/** Bringt Freitext aus dem Browser in eine sichere, gekürzte Form. */
export function personBereinigen(roh: unknown): CashbackPerson {
  const r = roh && typeof roh === "object" ? (roh as Record<string, unknown>) : {};
  const s = (key: keyof CashbackPerson, max = 120) =>
    String(r[key] ?? "")
      .replace(/[\u0000-\u001f]/g, " ")
      .trim()
      .slice(0, max);
  const anrede = s("anrede");
  const gekuendigt = s("bereitsGekuendigt");
  return {
    anrede: anrede === "Frau" || anrede === "Herr" ? anrede : "",
    vorname: s("vorname", 60),
    nachname: s("nachname", 60),
    geburtstag: s("geburtstag", 10),
    email: s("email", 120),
    telefon: s("telefon", 30),
    strasse: s("strasse", 80),
    hausnummer: s("hausnummer", 10),
    plz: s("plz", 5).replace(/\D/g, ""),
    ort: s("ort", 60),
    zaehlernummer: s("zaehlernummer", 40),
    marktlokation: s("marktlokation", 20).replace(/\s/g, ""),
    kundennummer: s("kundennummer", 40),
    vorversorger: s("vorversorger", 100),
    verbrauchRechnung: s("verbrauchRechnung", 12),
    bereitsGekuendigt: gekuendigt === "ja" || gekuendigt === "nein" ? gekuendigt : "",
    lieferbeginnWunsch: gekuendigt === "ja" ? s("lieferbeginnWunsch", 10) : "",
    maloUnbekannt: r.maloUnbekannt === true,
    iban: ibanNormal(s("iban", 40)),
    kontoinhaber: s("kontoinhaber", 80),
  };
}
