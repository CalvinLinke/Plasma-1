import { createHmac, timingSafeEqual } from "crypto";

// Signiert den Blob-Pfad mit DOWNLOAD_SECRET, damit der Download-Link nicht
// gefälscht werden kann — ganz ohne Login-System. Gleiche Logik in
// app/api/angebot (Link bauen) und app/api/rechnung (Link prüfen).

function getSecret(): string | null {
  return process.env.DOWNLOAD_SECRET || null;
}

export function signPathname(pathname: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(pathname).digest("hex");
}

export function verifyPathname(pathname: string, sig: string): boolean {
  const expected = signPathname(pathname);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Baut den absoluten Download-Link oder null, wenn DOWNLOAD_SECRET fehlt. */
export function buildDownloadUrl(origin: string, pathname: string): string | null {
  const sig = signPathname(pathname);
  if (!sig) return null;
  return `${origin}/api/rechnung?pathname=${encodeURIComponent(pathname)}&sig=${sig}`;
}
