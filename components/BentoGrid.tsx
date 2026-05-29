"use client";

import { Home, Building2, KeyRound, CheckCircle, XCircle, Users, ArrowRight, Upload, BarChart2, Shuffle } from "lucide-react";
import Link from "next/link";

const comparisons = [
  { feature: "Persönlicher Ansprechpartner", plasma: true, portal: false },
  { feature: "Exklusive Anbieter (nicht auf Portalen)", plasma: true, portal: false },
  { feature: "Vollständige Abwicklung — Kündigung inklusive", plasma: true, portal: false },
  { feature: "Kostenlos & unverbindlich", plasma: true, portal: true },
];

const zielgruppen = [
  {
    icon: Home,
    label: "Privatkunden",
    text: "Strom & Gas für Ihren Haushalt — günstiger, ohne eigenen Aufwand.",
    href: "/leistungen/privatkunden",
    iconBg: "rgba(22,163,74,0.10)",
    iconColor: "#16a34a",
    linkColor: "#16a34a",
  },
  {
    icon: Building2,
    label: "Gewerbekunden",
    text: "Planbare Energiekosten für Betriebe — mit echtem Ansprechpartner.",
    href: "/leistungen/gewerbekunden",
    iconBg: "rgba(123,97,255,0.12)",
    iconColor: "#7B61FF",
    linkColor: "#7B61FF",
  },
  {
    icon: KeyRound,
    label: "Hausverwaltungen",
    text: "Mehrere Einheiten, eine Lösung — skalierbar und zuverlässig.",
    href: "/leistungen/hausverwaltungen",
    iconBg: "rgba(75,0,130,0.10)",
    iconColor: "#4B0082",
    linkColor: "#4B0082",
  },
];

const processSteps = [
  { number: "01", icon: Upload,     label: "Hochladen",   desc: "Ihre Rechnung" },
  { number: "02", icon: BarChart2,  label: "Analyse",     desc: "Wir vergleichen" },
  { number: "03", icon: CheckCircle, label: "Entscheiden", desc: "Kein Druck" },
  { number: "04", icon: Shuffle,    label: "Fertig",      desc: "Wir übernehmen alles" },
];

export default function BentoGrid() {
  return (
    <section className="section-spacing bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">
            Ihre Vorteile
          </p>
          <h2 className="text-4xl font-bold text-marine">
            Warum Plasma Energie Solution?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 md:gap-4">

          {/* Karte 1 — Plasma vs. Portal */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-ambient card-hover border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-2">
              Was uns unterscheidet
            </p>
            <h3 className="text-2xl font-bold text-marine mb-7">
              Der Unterschied liegt im Detail
            </h3>

            {/* Tabellenkopf */}
            <div className="grid grid-cols-[1fr_52px_80px] sm:grid-cols-[1fr_80px_112px] mb-2 px-4">
              <span />
              <span className="text-xs font-bold text-violet-brand text-center">Plasma</span>
              <span className="text-xs font-semibold text-gray-400 text-center">Vergleichsportal</span>
            </div>

            <div className="space-y-2">
              {comparisons.map(({ feature, plasma, portal }) => (
                <div
                  key={feature}
                  className="grid grid-cols-[1fr_52px_80px] sm:grid-cols-[1fr_80px_112px] items-center bg-gray-50 rounded-2xl px-4 py-3"
                >
                  <span className="text-sm text-gray-700">{feature}</span>
                  <div className="flex justify-center">
                    {plasma
                      ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                      : <XCircle className="w-5 h-5 text-gray-300" />}
                  </div>
                  <div className="flex justify-center">
                    {portal
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : <XCircle className="w-5 h-5 text-gray-300" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Karte 2 — 300+ Stat */}
          <div className="bg-white rounded-3xl p-8 shadow-ambient card-hover border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-brand/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-violet-brand" />
              </div>
              <p className="text-5xl font-black text-marine mb-2">300+</p>
              <p className="text-sm text-gray-500 leading-snug">
                Zufriedene Kunden, die bereits von unserem Service profitieren
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-400 ml-1">4.9 / 5.0</span>
              </div>
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(22,163,74,0.10)", color: "#16a34a" }}
              >
                Ø 62 € Ersparnis/Jahr
              </span>
            </div>
          </div>

          {/* Geschwungene Trennlinie — nur Mobile */}
          <div className="md:hidden col-span-1 w-full py-2 -mx-1">
            <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 20 C40 4, 80 36, 130 20 S210 4, 270 20 S340 36, 400 20"
                stroke="url(#cableGradFull)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="0" cy="20" r="4" fill="#7B61FF" opacity="0.5" />
              <circle cx="400" cy="20" r="4" fill="#7B61FF" opacity="0.5" />
              <defs>
                <linearGradient id="cableGradFull" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4B0082" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#7B61FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4B0082" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Karten 3–5 — Drei Zielgruppen */}
          {zielgruppen.map(({ icon: Icon, label, text, href, iconBg, iconColor, linkColor }) => (
            <Link
              key={label}
              href={href}
              className="bg-white rounded-3xl p-7 shadow-ambient card-hover border border-gray-100 flex flex-col justify-between group"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </div>
                <h3 className="font-bold text-marine mb-2">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
              <div className="flex items-center gap-1 mt-5 text-sm font-semibold" style={{ color: linkColor }}>
                <span>Mehr erfahren</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}

          {/* Karte 6 — Brücke: Ihr Aufwand */}
          <div
            className="md:col-span-3 rounded-3xl p-8 md:p-10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #4B0082 0%, #1A1B4B 100%)" }}
          >
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(123,97,255,0.25) 0%, transparent 70%)" }}
            />

            <div className="relative flex flex-col md:flex-row gap-10 md:items-center">
              {/* Links: Headline + CTA */}
              <div className="flex-1">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Ihr Aufwand</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  2 Minuten. Das war's.
                </h3>
                <p className="text-white/65 text-sm leading-relaxed mb-6 max-w-sm">
                  Rechnung hochladen — wir übernehmen Analyse, Vergleich, Kündigung und Neuanmeldung. Sie müssen: nichts.
                </p>
                <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-7 py-3">
                  Jetzt kostenlos starten
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Rechts: Mini-Prozess mit Icons */}
              <div className="flex-1">
                <div className="flex items-start gap-1 sm:gap-2">
                  {processSteps.map((step, i) => {
                    const Icon = step.icon;
                    const isFirst = i === 0;
                    return (
                      <div key={step.number} className="flex items-start gap-1 sm:gap-2">
                        <div className="flex flex-col items-center">
                          <span className="text-white/35 text-[10px] font-semibold mb-1">{step.number}</span>
                          <div
                            className="w-11 h-11 rounded-2xl border border-white/15 flex items-center justify-center mb-2"
                            style={{ background: isFirst ? "rgba(123,97,255,0.45)" : "rgba(255,255,255,0.07)" }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white/70 text-xs font-semibold text-center whitespace-nowrap">{step.label}</span>
                          <span className="text-white/35 text-[10px] text-center mt-0.5 leading-tight max-w-[72px]">{step.desc}</span>
                        </div>
                        {i < processSteps.length - 1 && (
                          <div className="w-4 sm:w-8 h-px bg-white/15 mt-7 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-white/30 text-xs mt-4">
                  Schritt 01 ist Ihres — den Rest erledigen wir.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
