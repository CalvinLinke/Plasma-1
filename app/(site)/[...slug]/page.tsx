import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPageBySlug } from "@/lib/content";
import { canonical } from "@/lib/site";
import ContentPage, { type ContentVariant } from "@/components/ContentPage";
import OverviewPage from "@/components/OverviewPage";

// Nur echte Content-Slugs bedienen (statische Named-Routes haben Vorrang);
// unbekannte URLs → 404 statt Render-Versuch.
export const dynamicParams = false;

// Silo-Root-Slug → Listing-Kategorie
const SILO_ROOTS: Record<string, string> = {
  ratgeber: "Ratgeber",
  wechseln: "Wechselanlässe",
  tarife: "Tarife",
};

// Kategorie → Template-Variante
const VARIANT: Record<string, ContentVariant> = {
  Ratgeber: "ratgeber",
  Wechselanlässe: "wechselanlass",
  Tarife: "tarif",
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  const { meta } = page;
  const path = `/${slug.join("/")}`;
  const description =
    meta.description || (meta.keywords ? meta.keywords.split(",")[0].trim() : undefined);
  const ogUrl = `/api/og?title=${encodeURIComponent(meta.title)}`;

  return {
    title: meta.title,
    description,
    alternates: { canonical: meta.canonical || path },
    openGraph: {
      type: "article",
      title: meta.title,
      description,
      url: canonical(meta.canonical || path),
      images: [{ url: ogUrl, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description, images: [ogUrl] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const slugStr = slug.join("/");

  if (SILO_ROOTS[slugStr]) {
    return <OverviewPage page={page} kategorie={SILO_ROOTS[slugStr]} />;
  }

  const words = page.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));
  const variant = VARIANT[page.meta.kategorie] ?? "ratgeber";

  return <ContentPage page={page} readingTime={readingTime} variant={variant} />;
}
