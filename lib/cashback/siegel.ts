// Verschlüsselt das intern berechnete Angebot (inkl. Provision) für den
// Browser. Der Kunde kann den Inhalt weder lesen noch verändern; beim Auftrag
// entschlüsselt der Server ihn wieder und weiß so genau, welcher Tarif
// angezeigt wurde.

const GUELTIG_MS = 2 * 60 * 60 * 1000;

function geheimnis(): string {
  const wert = process.env.CASHBACK_SECRET || process.env.DOWNLOAD_SECRET;
  if (wert) return wert;
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("CASHBACK_SECRET fehlt");
  }
  return "nur-lokal-nicht-in-produktion";
}

async function schluessel(): Promise<CryptoKey> {
  const roh = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(geheimnis()));
  return crypto.subtle.importKey("raw", roh, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function zuBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

export async function versiegeln(daten: object): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const nutzlast = new TextEncoder().encode(JSON.stringify({ ...daten, _bis: Date.now() + GUELTIG_MS }));
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await schluessel(), nutzlast));
  return `${zuBase64Url(iv)}.${zuBase64Url(chiffre)}`;
}

export async function entsiegeln<T>(token: string): Promise<T | null> {
  try {
    const [ivTeil, chiffreTeil] = token.split(".");
    if (!ivTeil || !chiffreTeil) return null;
    const klar = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Buffer.from(ivTeil, "base64url") },
      await schluessel(),
      Buffer.from(chiffreTeil, "base64url"),
    );
    const daten = JSON.parse(new TextDecoder().decode(klar)) as T & { _bis?: number };
    if (!daten._bis || daten._bis < Date.now()) return null;
    return daten;
  } catch {
    return null;
  }
}

// Einfache Drosselung pro IP und Serverless-Instanz. Schützt vor allem den
// Partner-Login bei Neue Energie vor massenhaften Abfragen.
const zaehler = new Map<string, { anzahl: number; ab: number }>();

export function gedrosselt(schluesselWert: string, max: number, fensterMs: number): boolean {
  const jetzt = Date.now();
  const eintrag = zaehler.get(schluesselWert);
  if (!eintrag || jetzt - eintrag.ab > fensterMs) {
    zaehler.set(schluesselWert, { anzahl: 1, ab: jetzt });
    if (zaehler.size > 5000) zaehler.clear();
    return false;
  }
  eintrag.anzahl += 1;
  return eintrag.anzahl > max;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unbekannt"
  );
}
