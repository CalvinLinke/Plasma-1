import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AngebotForm from "@/components/AngebotForm";
import { getPartner, PARTNERS } from "@/lib/partners";

// Bekannte Partner vorab generieren (schneller, deterministisch).
export function generateStaticParams() {
  return Object.keys(PARTNERS).map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  title: "Ihr persönliches Stromangebot — Plasma Energie Solution",
  // Partner-Landingpages gehören nicht in den Google-Index.
  robots: { index: false, follow: false },
};

export default async function PartnerLanding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — Plasma-Branding. Layout/Co-Branding wird mit dem finalen Design verfeinert. */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">
            Ihr persönliches Angebot
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-marine mb-4">
            Sie laden Ihre Rechnung hoch –{" "}
            <span className="text-gradient">wir erledigen den Rest.</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Kostenlos. Unverbindlich. In unter 2 Minuten ausgefüllt.
          </p>
        </div>

        <AngebotForm partnerSlug={slug} />
      </div>
    </div>
  );
}
