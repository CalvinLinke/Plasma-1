// Minimaler Cookie-/Consent-Status — ohne externe Bibliothek.
// Gespeichert wird ausschließlich lokal im Browser (localStorage), nichts geht
// an den Server. "all" = externe Inhalte (z. B. Google Maps) erlaubt,
// "essential" = nur technisch notwendige Cookies. null = noch keine Entscheidung.
//
// Diese Funktionen laufen nur im Browser und dürfen daher nur aus
// Client-Komponenten ("use client") aufgerufen werden.

export type ConsentValue = "all" | "essential";

const KEY = "plasma_cookie_consent";
/** Wird bei jeder Änderung gefeuert, damit Banner und Karte reagieren. */
export const CONSENT_EVENT = "plasma-consent-change";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v === "all" || v === "essential" ? v : null;
}

export function setConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Setzt die Auswahl zurück (Widerruf, Art. 7 Abs. 3 DSGVO) — Banner erscheint erneut. */
export function resetConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
