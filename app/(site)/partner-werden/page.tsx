import Link from "next/link";
import { Handshake, TrendingUp, Users, Check, ArrowRight } from "lucide-react";

const benefits = [
  "Mehrwert für Ihre eigenen Kunden durch einen echten Mehrwert",
  "Zufriedene Kontakte, die sich an Ihre Empfehlung erinnern",
  "Langfristige und verlässliche Zusammenarbeit",
  "Kein Aufwand für Sie — wir erledigen alles",
  "Geeignet für Hausverwaltungen, Netzwerke und Empfehlungsgeber",
];

export default function PartnerWerden() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Partner werden</p>
          <h1 className="text-5xl font-bold text-marine mb-5">
            Gemeinsam mehr erreichen.
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Sie haben ein Netzwerk oder Kundenkontakte? Dann können wir zusammenarbeiten. Ohne Risiko, mit echtem Mehrwert für alle Beteiligten.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Handshake, title: "Empfehlungsgeber", desc: "Sie empfehlen uns weiter — wir kümmern uns um alles. Für Sie bedeutet das: null Aufwand, maximale Wirkung." },
            { icon: Users, title: "Hausverwaltungen", desc: "Sie verwalten Liegenschaften, wir optimieren die Energiekosten. Ein Partner für alles." },
            { icon: TrendingUp, title: "Netzwerke & Verbände", desc: "Sie haben Mitglieder mit Einsparpotenzial. Wir liefern die Lösung — unter Ihrem Namen, wenn Sie möchten." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl p-8 border border-gray-100 shadow-ambient card-hover bg-white">
              <div className="w-12 h-12 rounded-2xl bg-violet-brand/10 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-violet-brand" />
              </div>
              <h3 className="font-bold text-marine mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <div className="bg-surface rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-marine mb-5">Ihre Vorteile als Partner</h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#00F0FF" }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-3xl p-8 text-white flex flex-col justify-between"
            style={{ background: "linear-gradient(135deg, #4B0082, #1A1B4B)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(0,240,255,0.7)" }}>Ihr Vorteil</p>
              <h2 className="text-2xl font-bold mb-4 leading-snug">Empfehlen.<br />Entlasten.<br />Fertig.</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-3">
                Sie bringen uns in Kontakt — den Rest machen wir. Analyse, Angebot, Wechsel. Ihre Kontakte bekommen ein besseres Energieangebot, ohne sich um Papierkram oder Anbieterwechsel kümmern zu müssen.
              </p>
              <p className="text-white/40 text-xs leading-relaxed mb-6">
                Kein Aufwand. Keine Haftung. Echter Mehrwert für Ihr Netzwerk.
              </p>
            </div>
            <Link href="/kontakt" className="btn-primary inline-flex items-center gap-2 self-start px-6 py-3">
              Jetzt Partnerschaft anfragen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
