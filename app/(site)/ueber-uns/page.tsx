import Link from "next/link";
import { Heart, Wallet, Leaf, Zap, ArrowRight } from "lucide-react";

const values = [
  { icon: Heart, title: "Persönlich", desc: "Jeder Kunde hat einen echten Ansprechpartner — keine Hotlines, keine Warteschlangen." },
  { icon: Wallet, title: "Kostenorientiert", desc: "Jeder gesparte Euro zählt. Wir denken immer zuerst: Was bringt Ihnen den größten finanziellen Vorteil?" },
  { icon: Leaf, title: "Nachhaltig", desc: "Klimafreundliche Tarife sind keine Option zweiter Wahl. Wir machen sie zur ersten Empfehlung." },
  { icon: Zap, title: "Effizient", desc: "Digital. Papierlos. Schnell. Wir schätzen Ihre Zeit — und setzen das täglich um." },
];

export default function UeberUns() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Über uns</p>
          <h1 className="text-5xl font-bold text-marine mb-5">Menschen statt Konzern.</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Plasma Energie Solution ist kein Portal und kein Algorithmus. Wir sind ein Team, das täglich Kundengespräche führt, Rechnungen analysiert und Wechsel begleitet.
          </p>
        </div>

        {/* Philosophy */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          <div className="bg-surface rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-marine mb-4">Unsere Philosophie</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Vergleichsportale zeigen Ihnen eine Auswahl. Was sie nicht zeigen: die Anbieter, mit denen wir exklusive Konditionen haben. Die, die nirgends auftauchen.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Unser Ansatz ist anders. Wir analysieren Ihre konkrete Situation, suchen gezielt — und erklären Ihnen, warum ein Angebot besser ist als das andere. Kein Kleingedrucktes. Keine versteckten Provisionen.
            </p>
          </div>
          <div
            className="rounded-3xl p-8 text-white"
            style={{ background: "linear-gradient(135deg, #4B0082, #1A1B4B)" }}
          >
            <h2 className="text-2xl font-bold mb-4">Unsere Arbeitsweise</h2>
            <ul className="space-y-3 text-white/70">
              {["Vollständig digital — kein Papier, kein Fax", "Schnelle Reaktionszeiten, immer unter 48h", "Transparente Kommunikation auf Augenhöhe", "Unabhängig von einzelnen Anbietern"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-brand mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warum wir das tun */}
        <div className="mb-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-4">Warum wir das tun</p>
          <h2 className="text-3xl font-bold text-marine mb-4 leading-snug">
            Das Leben kostet mehr.<br />
            <span className="text-gradient">Das muss nicht so bleiben.</span>
          </h2>

          {/* Dekorative Trennlinie */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #7B61FF)" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-brand" />
            <div className="h-px w-16 rounded-full" style={{ background: "linear-gradient(90deg, #7B61FF, transparent)" }} />
          </div>

          <div className="max-w-2xl mx-auto space-y-5 text-gray-500 leading-relaxed mb-10">
            <p>
              Seit einigen Jahren ist das spürbar: Energie, Lebensmittel, Miete — die Ausgaben, die einfach mitlaufen, werden mehr. Viele Haushalte und Betriebe zahlen heute deutlich mehr als noch vor drei Jahren, ohne dass sie aktiv etwas geändert haben. Stille Vertragsverlängerungen, veraltete Tarife, Grundversorgung auf Autopilot.
            </p>
            <p>
              Wir haben das selbst gespürt — privat wie beruflich. Und das hat uns dazu gebracht, genauer hinzuschauen. Der erste Posten: Energie. Was wir gefunden haben, war erstaunlich. Tarife, die niemand mehr überprüft hatte. Konditionen aus einer anderen Zeit. Anbieter, von denen wir nie gehört hatten — und die trotzdem günstiger waren.
            </p>
            <p className="text-gray-400">
              Plasma ist aus dieser Erfahrung entstanden. Sparen heißt hier nicht Verzicht — es heißt, nicht mehr zu zahlen als nötig. Das ist für jeden möglich. Und selbst wer keine finanziellen Engpässe hat: Geld sinnlos ausgeben will niemand.
            </p>
          </div>

        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-marine text-center mb-10">Was uns leitet.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-ambient card-hover text-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-brand/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-violet-brand" />
                </div>
                <h3 className="font-bold text-marine mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #4B0082, #1A1B4B)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(0,240,255,0.7)" }}>Kein Portal. Kein Bot.</p>
          <h2 className="text-2xl font-bold text-white mb-3">Ein Mensch, der sich kümmert.</h2>
          <p className="text-white/50 mb-6 text-sm max-w-md mx-auto">
            Schicken Sie uns Ihre letzte Energierechnung — wir analysieren, vergleichen und erklären. Persönlich, kostenlos und ohne Druck.
          </p>
          <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Jetzt unverbindlich starten <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
