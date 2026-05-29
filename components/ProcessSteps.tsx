import { Upload, BarChart2, CheckCircle, Shuffle } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Rechnung hochladen",
    description:
      "Sie laden Ihre letzte Strom- oder Gasrechnung hoch — das dauert unter einer Minute. Keine weiteren Angaben nötig.",
  },
  {
    number: "02",
    icon: BarChart2,
    title: "Analyse & Angebot",
    description:
      "Wir prüfen Ihren Verbrauch, vergleichen exklusive Anbieter und senden Ihnen innerhalb von 48 Stunden ein konkretes Angebot.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Ihre Entscheidung",
    description:
      "Sie entscheiden in Ruhe. Kein Druck, kein verstecktes Kleingedrucktes. Kostenlos und unverbindlich.",
  },
  {
    number: "04",
    icon: Shuffle,
    title: "Wir übernehmen alles",
    description:
      "Plasma kündigt Ihren alten Vertrag und meldet Sie beim neuen Anbieter an. Sie tun: nichts.",
  },
];

export default function ProcessSteps() {
  return (
    <section id="prozess" className="section-spacing bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">
            So funktioniert es
          </p>
          <h2 className="text-4xl font-bold text-marine mb-4">
            Vier Schritte. Kein Aufwand.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Sie laden Ihre Strom- oder Gasrechnung hoch – wir erledigen den Rest. Vom Vergleich bis zur Anmeldung beim neuen Anbieter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const cardContent = (
              <>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-gradient-to-r from-violet-brand/30 to-transparent z-10" />
                )}
                <span className="text-6xl font-black text-gray-100 select-none absolute top-4 right-5 leading-none">
                  {step.number}
                </span>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, rgba(75,0,130,0.12), rgba(123,97,255,0.12))" }}
                >
                  <Icon className="w-6 h-6 text-violet-brand transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-marine mb-2 relative z-10">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">{step.description}</p>
                <div
                  className="absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #4B0082, #7B61FF)" }}
                >
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
              </>
            );

            if (i === 0) {
              return (
                <Link key={i} href="/angebot-erhalten" className="relative bg-white rounded-3xl p-7 shadow-ambient border border-gray-100 group card-hover">
                  {cardContent}
                </Link>
              );
            }
            return (
              <div key={i} className="relative bg-white rounded-3xl p-7 shadow-ambient border border-gray-100 group card-hover">
                {cardContent}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/angebot-erhalten"
            className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
          >
            Jetzt starten — kostenlos & unverbindlich
          </Link>
        </div>
      </div>
    </section>
  );
}
