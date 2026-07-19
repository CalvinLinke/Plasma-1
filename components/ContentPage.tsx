import { Download } from "lucide-react";
import type { Page } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";
import SchemaOrg from "@/components/SchemaOrg";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import ContentHeader from "@/components/ContentHeader";
import DirectAnswer from "@/components/DirectAnswer";
import CTA from "@/components/CTA";
import FAQSection from "@/components/FAQSection";
import AuthorBox from "@/components/AuthorBox";
import RelatedContent from "@/components/RelatedContent";

export type ContentVariant = "ratgeber" | "wechselanlass" | "tarif";

const SILO: Record<ContentVariant, { label: string; href: string }> = {
  ratgeber: { label: "Ratgeber", href: "/ratgeber" },
  wechselanlass: { label: "Wechselanlässe", href: "/wechseln" },
  tarif: { label: "Tarife", href: "/tarife" },
};

export default function ContentPage({
  page,
  readingTime,
  variant,
}: {
  page: Page;
  readingTime: number;
  variant: ContentVariant;
}) {
  const { meta } = page;
  const silo = SILO[variant];
  const isMoneyPage = variant !== "ratgeber";

  const crumbs: Crumb[] = [
    { label: silo.label, href: silo.href },
    { label: meta.title },
  ];
  const schemaCrumbs = [
    { name: silo.label, url: silo.href },
    { name: meta.title, url: `/${meta.slug}` },
  ];
  const pills = (meta.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 6);

  return (
    <>
      <SchemaOrg type="BreadcrumbList" data={{ items: schemaCrumbs }} />
      <SchemaOrg
        type="Article"
        data={{
          title: meta.title,
          url: absoluteUrl(`/${meta.slug}`),
          description: meta.description,
          datePublished: meta.datePublished,
          dateModified: meta.dateModified,
        }}
      />
      {meta.faqs?.length ? <SchemaOrg type="FAQPage" data={{ faqs: meta.faqs }} /> : null}
      {isMoneyPage ? (
        <SchemaOrg
          type="Service"
          data={{ name: meta.title, description: meta.description, serviceType: "Energievermittlung" }}
        />
      ) : null}

      {/* Hero */}
      {variant === "ratgeber" ? (
        <ContentHeader
          title={meta.title}
          kategorie={silo.label}
          readingTime={readingTime}
          keywords={meta.keywords}
          dateModified={meta.dateModified}
          breadcrumbs={crumbs}
        />
      ) : (
        <header
          className="relative overflow-hidden border-b border-gray-100"
          style={{ background: "linear-gradient(160deg, #EDE9FF 0%, #FFFFFF 45%, #E5F8FF 100%)" }}
        >
          <div
            className="absolute -top-40 -right-24 w-[34rem] h-[34rem] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(123,97,255,0.28), transparent 70%)" }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-16">
            <Breadcrumbs items={crumbs} />
            <div className="mt-5 flex items-center gap-2 text-sm">
              <span className="font-semibold uppercase tracking-widest text-violet-brand">{silo.label}</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500">{readingTime} Min. Lesezeit</span>
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-marine leading-[1.12]">
              {meta.title}
            </h1>
            {meta.hero_lead && (
              <p className="mt-5 text-lg text-gray-600 max-w-2xl leading-relaxed">{meta.hero_lead}</p>
            )}
            {pills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {pills.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-violet-brand/10 px-3 py-1 text-xs font-medium text-violet-brand"
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
            {meta.stats?.length ? (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {meta.stats.slice(0, 3).map((s, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-4 shadow-ambient">
                    <div className="text-2xl md:text-3xl font-black text-marine">{s.wert}</div>
                    <div className="mt-1 text-xs text-gray-500 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </header>
      )}

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <article className="space-y-14 md:space-y-16">
          {meta.direktantwort && (
            <DirectAnswer frage={meta.direktantwort.frage} antwort={meta.direktantwort.antwort} />
          )}

          {meta.lead_magnet_file && (
            <a
              href={`/downloads/${meta.lead_magnet_file}`}
              download
              className="flex items-center gap-4 rounded-2xl border border-violet-brand/20 bg-violet-brand/[0.05] p-5 transition-colors hover:bg-violet-brand/[0.1]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-brand/15">
                <Download className="h-5 w-5 text-violet-brand" />
              </span>
              <span>
                <span className="block font-semibold text-marine">{meta.lead_magnet || "Gratis-Download"}</span>
                <span className="block text-sm text-gray-500">Kostenlos herunterladen (PDF)</span>
              </span>
            </a>
          )}

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.htmlContent }} />

          <CTA
            variant="banner"
            topic={`${meta.title} ${meta.keywords ?? ""}`}
            leadMagnet={meta.lead_magnet}
            leadMagnetFile={meta.lead_magnet_file}
          />

          {meta.faqs?.length ? <FAQSection faqs={meta.faqs} /> : null}

          <AuthorBox />

          <RelatedContent currentSlug={meta.slug} kategorie={meta.kategorie} />
        </article>
      </div>
    </>
  );
}
