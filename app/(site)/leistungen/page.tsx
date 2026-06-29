import Link from "next/link";
import { Check, Leaf, Zap, Building2, ArrowRight } from "lucide-react";

const services = [
  {
    href: "/leistungen/privatkunden",
    icon: Leaf,
    color: "#16A34A",
    bg: "rgba(22,163,74,0.08)",
    title: "Privatkunden",
    sub: "Kosten senken ohne Aufwand",
    desc: "Strom und Gas günstiger — mit persönlicher Betreuung und vollständiger Abwicklung.",
  },
  {
    href: "/leistungen/gewerbekunden",
    icon: Zap,
    color: "#7B61FF",
    bg: "rgba(123,97,255,0.08)",
    title: "Gewerbekunden",
    sub: "Planbare Energiekosten",
    desc: "Wirtschaftliche Optimierung für Unternehmen aller Größen — effizient und zuverlässig.",
  },
  {
    href: "/leistungen/hausverwaltungen",
    icon: Building2,
    color: "#1A1B4B",
    bg: "rgba(26,27,75,0.06)",
    title: "Hausverwaltungen",
    sub: "Skalierbar für mehrere Einheiten",
    desc: "Gemeinschaftskosten senken, Liegenschaften optimieren — mit einem einzigen Ansprechpartner.",
  },
];

export default function Leistungen() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Leistungen</p>
          <h1 className="text-5xl font-bold text-marine mb-5">Für jeden die richtige Lösung.</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Ob Privathaushalt, Unternehmen oder Hausverwaltung — Plasma Energie Solution hat den passenden Ansatz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-3xl p-8 border border-gray-100 bg-white shadow-ambient card-hover flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: s.bg }}>
                  <Icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: s.color }}>{s.sub}</p>
                <h2 className="text-2xl font-bold text-marine mb-3">{s.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">{s.desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3" style={{ color: s.color }}>
                  Mehr erfahren <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
