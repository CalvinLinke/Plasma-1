// Zentrale Einstellungen der 50-€-Cashback-Strecke (/cashback).
// Alles Steuernde kommt aus Umgebungsvariablen, damit Robert in Vercel
// umschalten kann, ohne Code zu ändern.

export const CASHBACK_STANDARD_CODE = "DRESDEN50";

/** Alte Schreibweisen von Flyern/Landingpage, die auf den Hauptcode zeigen. */
const ALIASE: Record<string, string> = { DD50: "DRESDEN50" };

/**
 * Übermittlung an Neue Energie:
 * - "aus":  nur speichern und benachrichtigen, nichts an Neue Energie senden
 * - "test": Preisprüfung und Auftrag mit testMode=1 (legt KEINEN Vertrag an)
 * - "live": echter Auftrag (testMode=0). Erst nach Freigabe setzen.
 */
export type NeModus = "aus" | "test" | "live";

export function cashbackConfig() {
  const modus = (process.env.CASHBACK_NE_MODUS || "test").trim().toLowerCase();
  return {
    betragEur: Number(process.env.CASHBACK_BETRAG_EUR || 50),
    mindestProvisionEur: Number(process.env.CASHBACK_MIN_PROVISION_EUR || 80),
    neModus: (modus === "aus" || modus === "live" ? modus : "test") as NeModus,
    /** Nur lokal: Beispieltarife statt Partner-Portal. In Produktion immer aus. */
    demo: process.env.CASHBACK_DEMO === "1" && process.env.VERCEL_ENV !== "production",
    codes: (process.env.CASHBACK_CODES || CASHBACK_STANDARD_CODE)
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean),
    /** Interne Benachrichtigung. */
    internMail: process.env.CASHBACK_INTERN_MAIL || "box@plasma-energie.de",
  };
}

/** Normalisiert den Code aus der URL. Unbekannte Codes fallen auf den Standard zurück. */
export function normalisiereCode(roh: string | undefined | null): string {
  const code = (roh || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  const ziel = ALIASE[code] ?? code;
  const { codes } = cashbackConfig();
  return codes.includes(ziel) ? ziel : codes[0] || CASHBACK_STANDARD_CODE;
}

/** Verteilgebiet / Variante aus dem QR (?f=…), nur harmlose Zeichen. */
export function normalisiereQuelle(roh: string | undefined | null): string {
  return (roh || "").replace(/[^a-zA-Z0-9äöüÄÖÜß \-]/g, "").slice(0, 40);
}
