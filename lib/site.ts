// Kanonische Stamm-/Kontaktdaten (NAP) von Plasma Energie Solution.
// Single Source of Truth für JSON-LD (SchemaOrg), Metadata, Footer & Kontaktseite.

export const siteConfig = {
  name: "Plasma Energie Solution",
  titleSuffix: "Plasma Energie Solution",
  shortName: "Plasma",
  url: "https://www.plasma-energie.de",
  email: "box@plasma-energie.de",
  logo: "/Logo Plasma.png",
  description:
    "Unabhängige Vermittlung und Optimierung von Strom- und Gasverträgen für Privat- und Gewerbekunden. Deutschlandweit, persönlich statt anonym.",
} as const;

// Öffentliche Profile für Organization-`sameAs` (Entity-Linking / E-E-A-T).
// Nach und nach befüllen, sobald die Verzeichnis-/Social-Profile live sind
// (siehe marketing/local-listings.xlsx). Nur wirklich öffentliche URLs aufnehmen.
export const companySameAs: string[] = [
  // "https://www.google.com/maps?cid=…",
  // "https://www.provenexpert.com/plasma-energie-solution/",
  // "https://www.linkedin.com/company/…",
];

// Gewerbeerlaubnis nach § 34c GewO als wiederverwendbares Credential (Trust-Signal).
export const gewoCredential = {
  "@type": "EducationalOccupationalCredential",
  credentialCategory: "Gewerbeerlaubnis nach § 34c GewO",
  recognizedBy: { "@type": "GovernmentOrganization", name: "Stadt Dresden" },
} as const;

// Fachgebiete für Organization-`knowsAbout` (thematische Autorität, AEO).
export const knowsAbout: string[] = [
  "Stromvertrag",
  "Gasvertrag",
  "Stromanbieter wechseln",
  "Gasanbieter wechseln",
  "Ökostrom",
  "Grundversorgung",
  "Energieberatung",
  "Gewerbestrom",
  "Energiekosten senken",
  "Strom und Gas beim Umzug ummelden",
];

export const company = {
  name: siteConfig.name,
  legalName: "Plasma Energie Solution",
  founderName: "Jörg Hermann",
  email: siteConfig.email,
  vatId: "DE369748497",
  phone: {
    display: "+49 172 8182583",
    e164: "+491728182583",
    href: "tel:+491728182583",
  },
  whatsapp: {
    number: "491728182583",
    href: "https://wa.me/491728182583",
  },
  address: {
    street: "Grüne Straße 13b",
    postalCode: "01067",
    city: "Dresden",
    region: "Sachsen",
    regionCode: "DE-SN",
    country: "DE",
  },
  // Ungefaehre Koordinaten des Sitzes (01067 Dresden), bei Bedarf praezisieren.
  geo: { latitude: 51.0577, longitude: 13.7208 },
  // Deutschlandweit tätiger Dienstleister (Servicegebiet, kein Ladenlokal).
  areaServedCountry: "DE",
  // Telefonische Erreichbarkeit: noch unbestätigt. Sobald bestätigt, hier
  // befüllen (Schema.org-Tagesnamen) → erscheint automatisch im Schema.
  openingHours: [] as Array<{ dayOfWeek: string[]; opens: string; closes: string }>,
} as const;

export function absoluteUrl(pathname = "") {
  if (!pathname) return siteConfig.url;
  return `${siteConfig.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/** Canonical-URL für einen Root-Pfad ("/", "/ratgeber/x"). */
export function canonical(pathname: string): string {
  return pathname === "/" ? siteConfig.url : absoluteUrl(pathname);
}
