import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Page } from "@/lib/types";
import { getPagesByKategorie } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaOrg from "@/components/SchemaOrg";
import DirectAnswer from "@/components/DirectAnswer";
import CTA from "@/components/CTA";
import FAQSection from "@/components/FAQSection";

// Übersichtsseite für einen Silo-Root (/ratgeber, /wechseln, /tarife).
// Auto-Listing aller Seiten der Kategorie.
export default function OverviewPage({ page, kategorie }: { page: Page; kategorie: string }) {
  const { meta } = page;
  const pages = getPagesByKategorie(kategorie);

  return (
    <>
      <SchemaOrg
        type="BreadcrumbList"
        data={{ items: [{ name: meta.title, url: `/${meta.slug}` }] }}
      />
      {meta.faqs?.length ? <SchemaOrg type="FAQPage" data={{ faqs: meta.faqs }} /> : null}

      <header
        className="relative overflow-hidden border-b border-gray-100"
        style={{ background: "linear-gradient(160deg, #EDE9FF 0%, #FFFFFF 45%, #E5F8FF 100%)" }}
      >
        <div
          className="absolute -top-40 -right-24 w-[34rem] h-[34rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(123,97,255,0.28), transparent 70%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-16">
          <Breadcrumbs items={[{ label: meta.title }]} />
          <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-marine leading-[1.12]">
            {meta.title}
          </h1>
          {(meta.hero_lead || meta.description) && (
            <p className="mt-5 text-lg text-gray-600 max-w-2xl leading-relaxed">
              {meta.hero_lead || meta.description}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 space-y-14">
        {meta.direktantwort && (
          <div className="max-w-4xl">
            <DirectAnswer frage={meta.direktantwort.frage} antwort={meta.direktantwort.antwort} />
          </div>
        )}

        {pages.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-ambient card-hover"
              >
                <h2 className="font-bold text-marine leading-snug group-hover:text-violet-brand transition-colors">
                  {p.title}
                </h2>
                {p.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{p.description}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-brand">
                  Mehr erfahren <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Inhalte folgen in Kürze.</p>
        )}

        <CTA variant="banner" topic={meta.title} />

        {meta.faqs?.length ? (
          <div className="max-w-4xl">
            <FAQSection faqs={meta.faqs} />
          </div>
        ) : null}
      </div>
    </>
  );
}
