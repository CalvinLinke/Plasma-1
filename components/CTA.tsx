import Link from "next/link";
import { ArrowRight, Download, Phone } from "lucide-react";
import { company } from "@/lib/site";

// Energie-Heuristik: Beratungs-Intent → /kontakt, sonst Angebots-Intent → /angebot-erhalten.
const ADVICE_HINTS = [
  "beratung",
  "frage",
  "kündigung",
  "kuendigung",
  "widerspruch",
  "abrechnung",
  "streit",
  "problem",
  "recht",
];

function pickTarget(topic?: string): { href: string; label: string } {
  const t = (topic || "").toLowerCase();
  if (ADVICE_HINTS.some((k) => t.includes(k))) {
    return { href: "/kontakt", label: "Persönlich beraten lassen" };
  }
  return { href: "/angebot-erhalten", label: "Kostenlos Angebot anfordern" };
}

interface CTAProps {
  variant?: "banner" | "inline";
  topic?: string;
  headline?: string;
  description?: string;
  leadMagnet?: string;
  leadMagnetFile?: string;
}

export default function CTA({
  variant = "banner",
  topic,
  headline,
  description,
  leadMagnet,
  leadMagnetFile,
}: CTAProps) {
  const target = pickTarget(topic);
  const isOffer = target.href === "/angebot-erhalten";
  const head = headline || (isOffer ? "Zahlen Sie zu viel für Strom oder Gas?" : "Noch Fragen zu Ihrem Energievertrag?");
  const desc =
    description ||
    (isOffer
      ? "Laden Sie einfach Ihre aktuelle Rechnung hoch. Wir prüfen sie und finden Ihren passenden Tarif. Kostenlos und unverbindlich."
      : "Wir beraten Sie persönlich zu Wechsel, Kündigung und Tarifen, unabhängig und ohne Verpflichtung.");

  if (variant === "inline") {
    return (
      <div className="rounded-2xl border border-violet-brand/20 bg-violet-brand/[0.04] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-marine">{head}</p>
          <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
        </div>
        <Link href={target.href} className="btn-primary text-sm shrink-0 self-start sm:self-auto">
          <span className="flex items-center gap-2">
            {target.label} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-12 text-center">
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(123,97,255,0.35), transparent 60%)" }}
      />
      <div className="relative">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{head}</h2>
        <p className="mt-3 text-white/80 max-w-2xl mx-auto leading-relaxed">{desc}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={target.href}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-brand px-6 py-3 font-semibold text-white shadow-violet-glow transition-transform hover:scale-[1.03]"
          >
            {target.label} <ArrowRight className="w-4 h-4" />
          </Link>
          {leadMagnetFile && (
            <a
              href={`/downloads/${leadMagnetFile}`}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white border border-white/20 transition-colors hover:bg-white/20"
            >
              <Download className="w-4 h-4" /> {leadMagnet || "Gratis-Download"}
            </a>
          )}
          <a
            href={company.phone.href}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-white/80 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" /> {company.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
