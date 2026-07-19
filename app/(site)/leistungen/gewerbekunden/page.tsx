import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gewerbestrom & Gewerbegas für Unternehmen",
  description:
    "Energiekosten für Ihr Unternehmen senken: unabhängige Vermittlung von Gewerbestrom und Gewerbegas mit persönlicher Betreuung.",
  alternates: { canonical: "/leistungen/gewerbekunden" },
};
import { Check, Zap, ArrowRight, BarChart2, Clock, Users, TrendingDown } from "lucide-react";

const features = [
  "Wirtschaftliche Optimierung von Strom- und Gaskosten",
  "Planbare, stabile Konditionen für Ihre Kalkulation",
  "Reibungslose Abwicklung, ohne Betriebsunterbrechung",
  "Fester Ansprechpartner für Ihr Unternehmen",
  "Exklusive B2B-Tarife abseits der Vergleichsportale",
  "Kündigung und Neuanmeldung: wir übernehmen alles",
];

const tariffBars = [
  { label: "Grundversorger-Tarif (typisch)", percent: 100, color: "#E5E7EB", textColor: "#6B7280" },
  { label: "Öffentlicher Vergleichsportal-Tarif", percent: 87, color: "#a78bfa", textColor: "#7C3AED" },
  { label: "Plasma B2B-Exklusivtarif", percent: 76, color: "#7B61FF", textColor: "#4B0082" },
];

const leverage = [
  { label: "Jährliche Energiekosten", value: "30.000 €", highlight: false },
  { label: "Einsparung durch Plasma (ca. 12%)", value: "≈ 3.600 €", highlight: true },
  { label: "Entspricht Mehrumsatz von ...", value: "36.000 € *", highlight: false },
];

export default function Gewerbekunden() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(123,97,255,0.08)" }}>
              <Zap className="w-4 h-4 text-violet-brand" />
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-brand">Gewerbekunden</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-marine mb-5 leading-tight">
              Energiekosten als Hebel,{" "}
              <span className="text-gradient">nicht als Last.</span>
            </h1>
            <div className="space-y-4 text-gray-500 text-lg leading-relaxed mb-8">
              <p>
                Strom und Gas sind operative Fixkosten, sie laufen unabhängig davon, wie gut das Geschäft läuft. Was viele Unternehmen nicht wissen: die meisten Gewerbetarife werden still verlängert, oft zu Konditionen, die vor Jahren verhandelt wurden und heute längst nicht mehr marktgerecht sind.
              </p>
              <p>
                Der entscheidende Unterschied zu Vergleichsportalen: wir haben Zugang zu Tarifen, die dort nicht auftauchen. B2B-Konditionen, die auf Ihren tatsächlichen Verbrauch, Ihre Abnahmemenge und Ihre Laufzeitpräferenzen zugeschnitten werden, kein Standardangebot aus dem Katalog.
              </p>
              <p className="text-base text-gray-400">
                Jeder gesparte Euro bei den Energiekosten verbessert direkt Ihr Ergebnis. Ohne mehr Umsatz machen zu müssen.
              </p>
            </div>
            <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-7 py-4">
              Angebot für mein Unternehmen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-gray-100">
            <h3 className="font-bold text-marine mb-6">Was wir für Ihr Unternehmen tun:</h3>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#00F0FF" }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-20">
          {[
            { icon: BarChart2, value: "↓ Kosten", label: "Messbare Einsparungen" },
            { icon: Clock, value: "48h", label: "Bis zum ersten Angebot" },
            { icon: Users, value: "1:1", label: "Fester Ansprechpartner" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-ambient text-center card-hover">
              <Icon className="w-6 h-6 text-violet-brand mx-auto mb-3" />
              <p className="text-2xl font-bold text-marine">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Hebeleffekt — grafische Sektion */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Der Hebeleffekt</p>
            <h2 className="text-3xl font-bold text-marine mb-3">Was günstigere Energie wirklich bedeutet</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Strom und Gas sind einer der wenigen Kostenpositionen, die Sie ohne Umsatzsteigerung oder Stellenabbau direkt verbessern können.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Links: Tarifvergleich visuell */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-ambient">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Tarifvergleich Strom & Gas</p>
              <h3 className="text-lg font-bold text-marine mb-7">Drei Tarife. Ein klarer Unterschied.</h3>

              <div className="space-y-5 mb-7">
                {tariffBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">{bar.label}</span>
                      <span className="text-xs font-bold" style={{ color: bar.textColor }}>{bar.percent}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${bar.percent}%`, backgroundColor: bar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ backgroundColor: "rgba(22,163,74,0.07)" }}
              >
                <TrendingDown className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Potenzielle Einsparung</p>
                  <p className="text-sm font-bold text-emerald-600">Bis zu 24% gegenüber Grundversorgung</p>
                </div>
              </div>

              <p className="text-xs text-gray-300 mt-4">
                Indikative Darstellung auf Basis typischer Gewerbekunden-Vergleiche. Ihr Ergebnis hängt von Verbrauch, Region und Laufzeit ab.
              </p>
            </div>

            {/* Rechts: Hebelrechnung */}
            <div
              className="rounded-3xl p-8 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, rgba(75,0,130,0.05) 0%, rgba(123,97,255,0.08) 100%)", border: "1px solid rgba(123,97,255,0.12)" }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-2">Rechenbeispiel</p>
                <h3 className="text-lg font-bold text-marine mb-3">Was 3.600 € Einsparung bedeuten</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Bei einer typischen Gewinnmarge von 10% müsste Ihr Unternehmen 36.000 € Mehrumsatz erzielen, um denselben Ergebniseffekt zu erzielen. Durch Energieoptimierung ist das in wenigen Wochen erledigt.
                </p>
              </div>

              <div className="space-y-0">
                {leverage.map(({ label, value, highlight }, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-3.5 ${i < leverage.length - 1 ? "border-b border-white/60" : ""}`}
                  >
                    <span className="text-sm text-gray-500">{label}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: highlight ? "#16a34a" : "#1A1B4B" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-3">* Bei angenommener Nettomarge von 10%</p>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #4B0082, #1A1B4B)" }}>
          <h2 className="text-2xl font-bold text-white mb-3">Bereit für planbare Energiekosten?</h2>
          <p className="text-white/60 mb-6 text-sm">Schicken Sie uns Ihre letzte Rechnung, wir analysieren das Potenzial kostenlos.</p>
          <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Jetzt B2B-Angebot anfordern <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
