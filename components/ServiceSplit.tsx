import Link from "next/link";
import { Check, Leaf, Zap, Building2, ArrowRight } from "lucide-react";

const services = [
  {
    href: "/leistungen/privatkunden",
    icon: Leaf,
    iconColor: "#16A34A",
    iconBg: "rgba(22,163,74,0.1)",
    tag: "Privatkunden",
    title: "Weniger zahlen. Auf nichts verzichten.",
    description:
      "Strom und Gas sind Grundbedarf — kein Luxus. Was viele nicht wissen: ein Anbieterwechsel dauert selten länger als zwei Wochen und kostet Sie nichts.",
    features: [
      "Kosten dauerhaft senken",
      "Nachhaltige Tarife verfügbar",
      "Kündigung & Neuanmeldung übernehmen wir",
      "Auch Öko-Strom & Grünes Gas",
      "Kostenlos & unverbindlich",
    ],
    cta: "Für Privatkunden",
    gradient: "from-emerald-50 to-white",
  },
  {
    href: "/leistungen/gewerbekunden",
    icon: Zap,
    iconColor: "#7B61FF",
    iconBg: "rgba(123,97,255,0.1)",
    tag: "Gewerbekunden",
    title: "Energiekosten als Hebel, nicht als Last.",
    description:
      "Für Unternehmen sind Strom- und Gaskosten fester Bestandteil der Kalkulation. Mit dem richtigen Partner werden sie planbar — und sinken.",
    features: [
      "Wirtschaftliche Optimierung",
      "Planbare Energiekosten",
      "Professionelle Abwicklung",
      "Fester Ansprechpartner",
    ],
    cta: "Für Gewerbekunden",
    gradient: "from-violet-50 to-white",
  },
  {
    href: "/leistungen/hausverwaltungen",
    icon: Building2,
    iconColor: "#1A1B4B",
    iconBg: "rgba(26,27,75,0.08)",
    tag: "Hausverwaltungen",
    title: "Gemeinschaftskosten senken. Mieter entlasten.",
    description:
      "Wer mehrere Einheiten verwaltet, kennt das Problem: jede Liegenschaft hat andere Verträge, andere Laufzeiten, andere Konditionen. Wir bringen Ordnung rein.",
    features: [
      "Skalierbare Lösungen",
      "Mehrere Einheiten auf einmal",
      "Bündelverträge für bessere Konditionen",
      "Langfristige Einsparungen",
      "Zuverlässiger Ansprechpartner",
    ],
    cta: "Für Hausverwaltungen",
    gradient: "from-blue-50 to-white",
  },
];

export default function ServiceSplit() {
  return (
    <section className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">
            Leistungen
          </p>
          <h2 className="text-4xl font-bold text-marine">
            Für jeden die richtige Lösung.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.href}
                className={`rounded-3xl p-8 border border-gray-100 bg-gradient-to-b ${s.gradient} card-hover group relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Gradient border on hover (pseudo via box-shadow) */}
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: s.iconBg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: s.iconColor }} />
                    </div>
                    <span
                      className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ backgroundColor: s.iconBg, color: s.iconColor }}
                    >
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-marine mb-3 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {s.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-marine">
                        <Check className="w-4 h-4 shrink-0" style={{ color: "#00F0FF" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={s.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                  style={{ color: s.iconColor }}
                >
                  {s.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
