import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Energie für Hausverwaltungen",
  description:
    "Strom- und Gasverträge für Hausverwaltungen und Objekte, gebündelt, betreut und optimiert von Plasma Energie Solution.",
  alternates: { canonical: "/leistungen/hausverwaltungen" },
};
import { Check, Building2, ArrowRight, Package, TrendingDown, Shield, GitMerge, FileCheck, CalendarCheck } from "lucide-react";

const features = [
  "Bündelverträge für alle Einheiten bei einem Anbieter",
  "Senkung der Gemeinschaftskosten für Eigentümer und Mieter",
  "Bessere Struktur und Übersichtlichkeit für Ihre Verwaltung",
  "Stichtagsablesung, sauber passend zu Ihrer WEG-Abrechnung",
  "Skalierbare Lösungen von 5 bis 7.500 Einheiten",
  "Langfristig planbare Energiekosten für alle Objekte",
  "Ein Ansprechpartner für alle Liegenschaften",
  "Vollständige Abwicklung aller Wechsel und Kündigungen",
];

export default function Hausverwaltungen() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(26,27,75,0.06)" }}>
              <Building2 className="w-4 h-4 text-marine" />
              <span className="text-xs font-semibold uppercase tracking-wider text-marine">Hausverwaltungen</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-marine mb-5 leading-tight">
              Gemeinschaftskosten senken.{" "}
              <span className="text-gradient">Eigentümer glücklich machen.</span>
            </h1>
            <div className="space-y-4 text-gray-500 text-lg leading-relaxed mb-8">
              <p>
                Wer mehrere Einheiten verwaltet, kennt das Problem: jede Liegenschaft läuft bei einem anderen Anbieter, mit eigenen Laufzeiten, eigenen Konditionen, oft seit Jahren unverändert. Das kostet nicht nur Geld. Es kostet vor allem Zeit, die in der Verwaltung fehlt.
              </p>
              <p>
                Mit einem Bündelvertrag fassen wir alle Einheiten bei einem einzigen Anbieter zusammen. Das schafft Struktur: einheitliche Laufzeiten, eine zentrale Abrechnung, ein Ansprechpartner für alle Objekte. Und durch das gebündelte Volumen erzielen wir Konditionen, die ein einzelner Haushalt schlicht nicht verhandeln kann.
              </p>
              <p className="text-base text-gray-400">
                Was Eigentümer am Ende sehen: niedrigere Nebenkosten, weniger Diskussionen in der WEG-Versammlung. Was Sie gewinnen: deutlich weniger Verwaltungsaufwand.
              </p>
            </div>
            <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-7 py-4">
              Liegenschaften optimieren <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-gray-100">
            <h3 className="font-bold text-marine mb-6">Was wir für Hausverwaltungen leisten:</h3>
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

        <div className="grid grid-cols-3 gap-4 mb-20">
          {[
            { icon: Package, value: "Bündelvertrag", label: "Alle Einheiten, ein Anbieter" },
            { icon: TrendingDown, value: "↓↓", label: "Gemeinschaftskosten senken" },
            { icon: Shield, value: "1", label: "Ansprechpartner für alles" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-ambient text-center card-hover">
              <Icon className="w-6 h-6 text-violet-brand mx-auto mb-3" />
              <p className="text-xl font-bold text-marine">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* 2×2 Highlights */}
        <div className="rounded-3xl p-8 mb-20" style={{ backgroundColor: "#F4F3FF", border: "1px solid rgba(123,97,255,0.14)" }}>
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-2">Was das konkret bedeutet</p>
            <h2 className="text-2xl font-bold text-marine">Ein Bündelvertrag. Vier Wirkungen.</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">

            {/* Karte 1 — Struktur: 60 Einheiten → Anbieter X */}
            <div className="bg-white rounded-2xl p-6 border border-white shadow-ambient">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(123,97,255,0.10)" }}>
                  <GitMerge className="w-4 h-4 text-violet-brand" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-brand">Struktur</span>
              </div>
              <div className="flex items-center gap-4 mb-5 px-1">
                {/* Unit grid */}
                <div className="relative shrink-0">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: "rgba(123,97,255,0.18)", border: "1px solid rgba(123,97,255,0.25)" }} />
                    ))}
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-full px-1.5 py-0.5 text-white text-[9px] font-bold" style={{ background: "#7B61FF" }}>
                    60
                  </div>
                </div>
                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-violet-brand shrink-0" />
                {/* Provider X */}
                <div className="flex flex-col items-center justify-center w-14 h-12 rounded-xl border-2 shrink-0" style={{ borderColor: "rgba(123,97,255,0.3)", backgroundColor: "rgba(123,97,255,0.05)" }}>
                  <span className="text-[9px] font-semibold text-gray-400 leading-none">Anbieter</span>
                  <span className="text-2xl font-black text-marine leading-none mt-0.5">X</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-marine mb-1">60 : 1</p>
              <p className="text-sm font-semibold text-marine mb-1.5">Alle Einheiten bei einem Anbieter</p>
              <p className="text-xs text-gray-400 leading-relaxed">Statt verteilter Einzelverträge: ein Bündelvertrag, eine Laufzeit, eine zentrale Abrechnung.</p>
            </div>

            {/* Karte 2 — Einsparung: Balkenvergleich */}
            <div className="bg-white rounded-2xl p-6 border border-white shadow-ambient">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(123,97,255,0.10)" }}>
                  <TrendingDown className="w-4 h-4 text-violet-brand" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-brand">Einsparung</span>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { label: "Einzelverträge", percent: 100, color: "#E5E7EB", textColor: "#9CA3AF" },
                  { label: "Bündelvertrag", percent: 90, color: "#7B61FF", textColor: "#4B0082" },
                ].map(({ label, percent, color, textColor }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-xs font-bold" style={{ color: textColor }}>{percent}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-600 font-semibold">≈ 10% weniger durch Volumenvorteil</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-marine mb-1">≈ 10 %</p>
              <p className="text-sm font-semibold text-marine mb-1.5">Günstigere Konditionen durch Volumen</p>
              <p className="text-xs text-gray-400 leading-relaxed">Mehr Einheiten bedeuten mehr Verhandlungsmacht: Preise, die kein Einzelhaushalt erzielt.</p>
            </div>

            {/* Karte 3 — Übersicht: verteilt vs. zentral */}
            <div className="bg-white rounded-2xl p-6 border border-white shadow-ambient">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(123,97,255,0.10)" }}>
                  <FileCheck className="w-4 h-4 text-violet-brand" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-brand">Übersicht</span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                {/* Verteilt — 4 Farben */}
                <div className="flex-1 rounded-xl p-3" style={{ backgroundColor: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
                  <p className="text-[9px] font-semibold text-red-300 mb-2">Verteilt</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "#c4b5fd","#c4b5fd","#c4b5fd",
                      "#6ee7b7","#6ee7b7","#6ee7b7",
                      "#fcd34d","#fcd34d","#fcd34d",
                      "#93c5fd","#93c5fd","#93c5fd",
                    ].map((bg, i) => (
                      <div key={i} className="w-3.5 h-4 rounded-sm" style={{ backgroundColor: bg, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                {/* Zentral — eine Farbe */}
                <div className="flex-1 rounded-xl p-3" style={{ backgroundColor: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)" }}>
                  <p className="text-[9px] font-semibold text-emerald-600 mb-2">Zentral</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-3.5 h-4 rounded-sm" style={{ backgroundColor: "rgba(123,97,255,0.25)", border: "1px solid rgba(123,97,255,0.3)" }} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-marine mb-1">Alles zentral</p>
              <p className="text-sm font-semibold text-marine mb-1.5">Gleich viele Rechnungen, volle Übersicht</p>
              <p className="text-xs text-gray-400 leading-relaxed">Die Anzahl der Rechnungen bleibt gleich, aber alle kommen von einem Anbieter. Kein Zuordnen, kein Suchen.</p>
            </div>

            {/* Karte 4 — Stichtagsablesung */}
            <div className="bg-white rounded-2xl p-6 border border-white shadow-ambient">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(123,97,255,0.10)" }}>
                  <CalendarCheck className="w-4 h-4 text-violet-brand" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-brand">Abrechnung</span>
              </div>
              {/* Visual: Jahrestimeline mit Stichtag */}
              <div className="rounded-xl p-3.5 mb-5" style={{ backgroundColor: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.12)" }}>
                <p className="text-[9px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">Abrechnungsjahr</p>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100" />
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4B0082,#7B61FF)" }}>
                    <CalendarCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] text-gray-300">Jan</span>
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-violet-brand">Stichtag</span>
                    <p className="text-[8px] text-gray-400">Alle Einheiten gleichzeitig</p>
                  </div>
                  <span className="text-[9px] text-gray-300">Dez</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-marine mb-1">1 Stichtag</p>
              <p className="text-sm font-semibold text-marine mb-1.5">Perfekt für Ihre WEG-Abrechnung</p>
              <p className="text-xs text-gray-400 leading-relaxed">Alle Einheiten werden zum selben Datum abgelesen, keine Zwischenablesungen, sauber passend zu Ihren Jahresterminen.</p>
            </div>

          </div>
        </div>

        <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #4B0082, #1A1B4B)" }}>
          <h2 className="text-2xl font-bold text-white mb-2">Mehr Struktur. Mehr Zeit.</h2>
          <p className="text-lg font-semibold mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Weniger Kosten. Zufriedenere Eigentümer.</p>
          <p className="text-white/50 mb-6 text-sm max-w-md mx-auto">Treten Sie mit uns in Kontakt, wir analysieren Ihre Situation und liefern das beste Konzept für Ihre Liegenschaften.</p>
          <Link href="/kontakt" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Jetzt Kontakt aufnehmen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
