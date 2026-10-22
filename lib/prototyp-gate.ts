export const PROTOTYP_COOKIE = "prototyp_gate";
export const PROTOTYP_PASSWORT = "schweinenase";
const PAYLOAD = "plasma-prototyp-v1";

export function sichereWeiterleitung(wert: string | undefined): string {
  if (!wert || !wert.startsWith("/prototyp") || wert.startsWith("//") || wert.includes("..")) {
    return "/prototyp/wechsel";
  }
  if (wert.startsWith("/prototyp/zugang") || wert.includes("\\") || wert.includes("://")) {
    return "/prototyp/wechsel";
  }
  return wert;
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

function gleich(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function passwortStimmt(eingabe: string, passwort: string): Promise<boolean> {
  return gleich(await sha256(eingabe), await sha256(passwort));
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function prototypToken(passwort: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passwort),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(PAYLOAD));
  return base64url(new Uint8Array(sig));
}

export async function tokenStimmt(cookie: string, passwort: string): Promise<boolean> {
  const erwartet = await prototypToken(passwort);
  return gleich(new TextEncoder().encode(cookie), new TextEncoder().encode(erwartet));
}
