import type { FAQ } from "@/lib/types";
import {
  absoluteUrl,
  siteConfig,
  companySameAs,
  gewoCredential,
  knowsAbout,
  company,
} from "@/lib/site";

// RSC – einsprachig (DE). Emittiert JSON-LD für Organization/LocalBusiness,
// FAQPage, Article, BreadcrumbList und Service.

interface SchemaOrgProps {
  type: "LocalBusiness" | "WebSite" | "FAQPage" | "Article" | "BreadcrumbList" | "Service";
  data?: Record<string, unknown>;
}

const IN_LANGUAGE = "de-DE";

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#business"),
    name: siteConfig.name,
    legalName: company.legalName,
    description:
      `Plasma Energie Solution (Geschäftsführung ${company.founderName}) ist ein unabhängiger Energievermittler mit Sitz in ${company.address.street}, ${company.address.postalCode} ${company.address.city}. Vermittlung und Optimierung von Strom- und Gasverträgen für Privat- und Gewerbekunden, deutschlandweit. Kostenlos und persönlich.`,
    disambiguatingDescription:
      "Unabhängiger Energievermittler (Strom & Gas) mit Gewerbeerlaubnis nach § 34c GewO. Eigenständige Marke „Plasma Energie Solution“, kein Energieversorger und kein anonymes Vergleichsportal.",
    slogan: "Energieverträge optimiert, persönlich statt anonym.",
    serviceType: "Energievermittlung / Strom- und Gasverträge",
    knowsAbout,
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Vermittlung & Optimierung von Strom- und Gasverträgen",
          serviceType: "Energievermittlung",
          areaServed: { "@type": "Country", name: "Deutschland" },
        },
      },
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "0",
          priceCurrency: "EUR",
        },
        itemOffered: {
          "@type": "Service",
          name: "Kostenlose Energiekosten-Analyse & Angebot",
          serviceType: "Energieberatung",
          areaServed: { "@type": "Country", name: "Deutschland" },
        },
      },
    ],
    hasCredential: gewoCredential,
    sameAs: companySameAs,
    founder: {
      "@type": "Person",
      name: company.founderName,
    },
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.logo),
    logo: absoluteUrl(siteConfig.logo),
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.geo.latitude,
      longitude: company.geo.longitude,
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    knowsLanguage: ["de"],
    telephone: company.phone.e164,
    email: company.email,
    vatID: company.vatId,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    ...(company.openingHours.length
      ? {
          openingHoursSpecification: company.openingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.dayOfWeek,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: company.phone.e164,
      email: company.email,
      contactType: "customer service",
      areaServed: "DE",
      availableLanguage: ["German"],
    },
  };
}

function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: IN_LANGUAGE,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.frage,
      acceptedAnswer: { "@type": "Answer", text: faq.antwort },
    })),
  };
}

function articleSchema(data: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
    },
    mainEntityOfPage: data.url,
    inLanguage: IN_LANGUAGE,
    isAccessibleForFree: true,
    datePublished: (data.datePublished as string) || "2026-07-01",
    dateModified: (data.dateModified as string) || (data.datePublished as string) || "2026-07-01",
    ...(data.description ? { description: data.description } : {}),
    ...(data.image ? { image: absoluteUrl(data.image as string) } : {}),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  };
}

function serviceSchema(data: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: (data.serviceType as string) || "Energievermittlung",
    name: data.name,
    ...(data.description ? { description: data.description } : {}),
    provider: {
      "@type": "LocalBusiness",
      "@id": absoluteUrl("/#business"),
      name: siteConfig.name,
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
  };
}

function breadcrumbSchema(data: Record<string, unknown>) {
  const items = (data.items as { name: string; url: string }[]) || [];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: absoluteUrl("/") },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: absoluteUrl(item.url),
      })),
    ],
  };
}

function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: IN_LANGUAGE,
    publisher: { "@id": absoluteUrl("/#business") },
  };
}

export default function SchemaOrg({ type, data = {} }: SchemaOrgProps) {
  let schema;
  switch (type) {
    case "LocalBusiness":
      schema = localBusinessSchema();
      break;
    case "WebSite":
      schema = webSiteSchema();
      break;
    case "FAQPage":
      schema = faqSchema(data.faqs as FAQ[]);
      break;
    case "Article":
      schema = articleSchema(data);
      break;
    case "BreadcrumbList":
      schema = breadcrumbSchema(data);
      break;
    case "Service":
      schema = serviceSchema(data);
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
