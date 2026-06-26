// Partner-Registry — einzige Wahrheitsquelle für Kooperationspartner.
// Neuer Partner = ein Eintrag hier. Keine Datenbank nötig.
//
// Der Slug ist Teil der Landing-Page-URL: /p/<slug>  (z. B. /p/tony).
// Der `name` landet in der Angebots-E-Mail ("[PARTNER: …]") — er stammt
// IMMER aus dieser Liste, nie aus rohem User-Input.

export type Partner = {
  /** Anzeigename, erscheint in der Provisions-E-Mail. */
  name: string;
  /** Nur aktive Partner sind erreichbar; auf false setzen statt löschen. */
  active: boolean;
  /** Optionales Co-Branding auf der Landing-Page (Layout kommt mit dem Design). */
  logo?: string;
  headline?: string;
};

export const PARTNERS = {
  tony: { name: "Tony M.", active: true },
} as const satisfies Record<string, Partner>;

export type PartnerSlug = keyof typeof PARTNERS;

/** Liefert den Partner zum Slug oder null (unbekannt / inaktiv). */
export function getPartner(slug: string | undefined | null): Partner | null {
  if (!slug) return null;
  const partner = (PARTNERS as Record<string, Partner>)[slug];
  if (!partner || !partner.active) return null;
  return partner;
}
