import Link from "next/link";
import { Check, Leaf, ArrowRight, TrendingDown, Shield, Upload, BarChart2, Shuffle, CheckCircle } from "lucide-react";

const features = [
  "Strom- und Gaskosten dauerhaft senken — nicht nur einmalig",
  "Nachhaltige und klimafreundliche Tarife für Strom & Gas",
  "Auch Öko-Strom und Grünes Gas auf Wunsch",
  "Kündigung und Neuanmeldung übernehmen wir komplett",
  "Exklusive Anbieter, die auf Vergleichsportalen fehlen",
  "Persönlicher Ansprechpartner für alle Fragen",
  "Kostenlos und vollständig unverbindlich",
];

const process = [
  {
    icon: Upload,
    step: "Sie",
    title: "Rechnung hochladen",
    desc: "Ihre letzte Strom- oder Gasrechnung — fertig. Mehr brauchen wir nicht.",
    highlight: true,
  },
  {
    icon: BarChart2,
    step: "Wir",
    title: "Analysieren & vergleichen",
    desc: "Wir prüfen Ihren Verbrauch und vergleichen exklusive Tarife — auch solche, die auf Portalen fehlen.",
    highlight: false,
  },
  {
    icon: CheckCircle,
    step: "Sie",
    title: "Entscheiden in Ruhe",
    desc: "Sie erhalten ein konkretes Angebot. Kein Druck, kein Kleingedrucktes. Nur dann, wenn es sich wirklich lohnt.",
    highlight: true,
  },
  {
    icon: Shuffle,
    step: "Wir",
    title: "Übernehmen alles",
    desc: "Kündigung, Neuanmeldung, Kommunikation mit dem Anbieter — wir erledigen jeden Schritt.",
    highlight: false,
  },
];

export default function Privatkunden() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(22,163,74,0.08)" }}>
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Privatkunden</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-marine mb-5 leading-tight">
              Weniger zahlen. <br />
              <span className="text-gradient">Ohne Abstriche.</span>
            </h1>
            <div className="space-y-4 text-gray-500 text-lg leading-relaxed mb-8">
              <p>
                Strom und Gas gehören zu den wenigen Ausgaben, bei denen Sie mit einem einzigen Schritt dauerhaft sparen können — ohne auf irgendetwas zu verzichten. Kein Techniker, kein Umzug, kein Ausfall. Die Versorgung läuft nahtlos weiter, nur der Preis sinkt.
              </p>
              <p>
                Was die meisten nicht wissen: viele Haushalte zahlen seit Jahren mehr als nötig, weil Grundversorger-Tarife selten die günstigsten sind. Wir haben Zugang zu Anbietern, die auf öffentlichen Vergleichsportalen gar nicht auftauchen — und holen für Sie das Angebot, das wirklich zu Ihrem Verbrauch passt.
              </p>
              <p className="text-base text-gray-400">
                Ihr Aufwand: eine Rechnung hochladen. Den Rest erledigen wir.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-7 py-4">
                Jetzt Angebot anfordern <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Feature List */}
          <div className="bg-surface rounded-3xl p-8 border border-gray-100">
            <h3 className="font-bold text-marine mb-6">Das ist im Service enthalten:</h3>
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
            { icon: TrendingDown, value: "62 €", label: "Ø Ersparnis pro Jahr" },
            { icon: Upload, value: "1×", label: "Hochladen — mehr tun Sie nicht" },
            { icon: Shield, value: "0 €", label: "Kein Risiko, keine Kosten" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-ambient text-center card-hover">
              <Icon className="w-6 h-6 text-violet-brand mx-auto mb-3" />
              <p className="text-2xl font-bold text-marine">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Prozess — mühelos für Sie */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">So einfach geht's</p>
            <h2 className="text-3xl font-bold text-marine mb-3">Vier Schritte. Zwei davon sind unsere.</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              Sie laden Ihre Rechnung hoch und treffen am Ende die Entscheidung — alles dazwischen übernehmen wir.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className={`rounded-3xl p-6 border relative ${
                    p.highlight
                      ? "bg-white border-gray-100 shadow-ambient"
                      : "border-gray-100"
                  }`}
                  style={!p.highlight ? { backgroundColor: "rgba(75,0,130,0.04)" } : {}}
                >
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4"
                    style={
                      p.highlight
                        ? { backgroundColor: "rgba(22,163,74,0.10)", color: "#16a34a" }
                        : { backgroundColor: "rgba(123,97,255,0.12)", color: "#7B61FF" }
                    }
                  >
                    {p.step}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: p.highlight
                        ? "rgba(22,163,74,0.10)"
                        : "rgba(123,97,255,0.12)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: p.highlight ? "#16a34a" : "#7B61FF" }}
                    />
                  </div>
                  <h3 className="font-bold text-marine text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  <span className="absolute top-5 right-5 text-4xl font-black text-gray-100 select-none leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #4B0082, #1A1B4B)" }}>
          <h2 className="text-2xl font-bold text-white mb-3">Bereit, weniger zu zahlen?</h2>
          <p className="text-white/60 mb-6 text-sm">Laden Sie Ihre letzte Energierechnung hoch — in unter 2 Minuten.</p>
          <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Jetzt kostenlos starten <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
