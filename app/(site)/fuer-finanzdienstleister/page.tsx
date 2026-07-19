import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  TrendingUp,
  Zap,
  ShieldCheck,
  Phone,
  Check,
  Handshake,
  Users,
  MessageCircle,
  Flame,
  PiggyBank,
} from "lucide-react";
import SchemaOrg from "@/components/SchemaOrg";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Für Finanzdienstleister und Makler",
  description:
    "Verwandeln Sie Ihre Vermittlungsprämie in einen Vorteil für Ihren Kunden. Energie als starker Gesprächsanlass, mehr Bindung und Zusatzertrag aus Ihrem Bestand. Die Arbeit übernehmen wir.",
  alternates: { canonical: "/fuer-finanzdienstleister" },
  openGraph: {
    type: "website",
    title: "Partnerprogramm für Finanzdienstleister und Makler",
    description:
      "Energie als Gesprächsanlass: Ihr Kunde spart, Sie gewinnen Vertrauen und Zusatzertrag. Wir übernehmen Vergleich, Wechsel und Betreuung.",
    url: "https://www.plasma-energie.de/fuer-finanzdienstleister",
    images: [{ url: "/api/og?title=Partnerprogramm%20für%20Finanzdienstleister", width: 1200, height: 630 }],
  },
};

const cards = [
  {
    icon: Gift,
    title: "Ihr Kunde gewinnt",
    text: "Er bekommt einen besseren Tarif, oft mehrere Hundert Euro im Jahr. Auf Wunsch geben Sie ihm Ihre Vermittlungsprämie als Cashback weiter. Ihr Kunde merkt: Sie denken an sein Geld.",
  },
  {
    icon: TrendingUp,
    title: "Sie gewinnen",
    text: "Ein guter Grund, sich wieder zu melden. Mehr Bindung, ein Thema das jeden betrifft, und ein zusätzlicher Ertrag aus einem Bestand, den Sie längst betreuen.",
  },
  {
    icon: Handshake,
    title: "Wir machen die Arbeit",
    text: "Rechnung hochladen genügt. Wir prüfen unabhängig, wickeln den Wechsel ab und betreuen weiter. Kein Aufwand und kein Risiko für Ihre Zulassung.",
  },
];

const beraterVorteile = [
  {
    icon: Users,
    title: "Gutes für Ihre Kunden",
    text: "Echtes Sparen bei Strom und Gas ist ein greifbarer Gefallen. Ihr Kunde erlebt Sie als jemanden, der an sein Geld denkt.",
  },
  {
    icon: TrendingUp,
    title: "Mehr aus Ihrem Bestand",
    text: "Sie holen zusätzlichen Ertrag aus Kundenbeziehungen, die Sie längst pflegen. Kein Neukunde nötig, nur ein neues Angebot für bestehende Kontakte.",
  },
  {
    icon: MessageCircle,
    title: "Neuer Gesprächsanlass",
    text: "Ein legitimer Grund, sich wieder zu melden. Wer beim Sparen hilft, darf danach auch über Vorsorge und Absicherung sprechen.",
  },
  {
    icon: Flame,
    title: "Am Puls der Zeit",
    text: "Steigende Energiekosten beschäftigen gerade jeden. Sie greifen ein aktuelles Thema auf und zeigen, dass Sie mitdenken.",
  },
];

const steps = [
  {
    title: "Sie geben den Anstoß",
    text: "Sie sprechen Ihren Kunden auf seine Energiekosten an oder reichen mit seinem Einverständnis die aktuelle Rechnung ein.",
  },
  {
    title: "Wir prüfen unabhängig",
    text: "Wir vergleichen Strom und Gas neutral und finden den passenden Tarif für seinen Verbrauch.",
  },
  {
    title: "Ihr Kunde spart",
    text: "Der Wechsel läuft über uns, ohne Versorgungslücke. Auf Wunsch fließt Ihre Prämie als Cashback an ihn zurück.",
  },
  {
    title: "Sie bleiben der Held",
    text: "Ihr Kunde erinnert sich an den Berater, der ihm bares Geld gespart hat. Ihre Empfehlung vergüten wir.",
  },
];

const faqs = [
  {
    frage: "Was kostet mich das?",
    antwort:
      "Nichts. Für Sie und Ihren Kunden ist die Prüfung kostenlos und unverbindlich. Es entsteht keine Verpflichtung.",
  },
  {
    frage: "Wie viel Aufwand habe ich?",
    antwort:
      "Sehr wenig. Sie geben den Anstoß, den Rest übernehmen wir: Vergleich, Wechsel, Kommunikation mit den Anbietern und laufende Betreuung.",
  },
  {
    frage: "Wie werde ich vergütet?",
    antwort:
      "Sie erhalten eine Vergütung für vermittelte Verträge. Die Details klären wir persönlich. Auf Wunsch geben Sie diese ganz oder teilweise als Cashback an Ihren Kunden weiter.",
  },
  {
    frage: "Passt das zu meiner Zulassung?",
    antwort:
      "Sie empfehlen nur. Die Energievermittlung übernehmen wir mit unserer Erlaubnis nach §34c GewO. Sie bleiben in Ihrer Rolle als Berater.",
  },
  {
    frage: "Was ist mit dem Datenschutz?",
    antwort:
      "Kundendaten fließen ausschließlich mit Einverständnis Ihres Kunden. Wir arbeiten DSGVO-konform und geben nichts an Dritte weiter.",
  },
];

export default function FuerFinanzdienstleister() {
  return (
    <>
      <SchemaOrg
        type="BreadcrumbList"
        data={{ items: [{ name: "Für Finanzdienstleister", url: "/fuer-finanzdienstleister" }] }}
      />
      <SchemaOrg
        type="Service"
        data={{
          name: "Energie-Partnerprogramm für Finanzdienstleister",
          serviceType: "Vertriebspartnerschaft Energievermittlung",
          description:
            "Kooperationsprogramm für Finanz- und Versicherungsmakler: Energieoptimierung für den eigenen Kundenbestand mit Vergütung und optionalem Kunden-Cashback.",
        }}
      />

      {/* Hero */}
      <header
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #EDE9FF 0%, #FFFFFF 45%, #E5F8FF 100%)" }}
      >
        <div
          className="absolute -top-40 -right-24 w-[36rem] h-[36rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(123,97,255,0.28), transparent 70%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-brand">
            Partnerprogramm für Finanz- und Versicherungsmakler
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-marine leading-[1.1] max-w-3xl">
            Machen Sie Energie zu Ihrem <span className="text-gradient">stärksten Kundengespräch</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed">
            Fast alle Ihre Kunden zahlen zu viel für Strom und Gas. Sie geben den Anstoß, wir übernehmen
            Vergleich und Wechsel, und Ihr Kunde bekommt einen spürbar besseren Deal. Das schafft Vertrauen,
            einen neuen Gesprächsanlass und Zusatzertrag aus Ihrem Bestand. Und was Ihr Kunde spart, wird zu
            Budget für Ihre Sparpläne und Vorsorge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className="btn-primary">
              <span className="flex items-center gap-2">
                Partner werden <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <a
              href="#ablauf"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-marine px-6 py-3 font-semibold text-marine transition-colors hover:bg-marine hover:text-white"
            >
              So funktioniert&apos;s
            </a>
          </div>
        </div>
      </header>

      {/* Die Idee: 3 Karten */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-marine">
              Eine Empfehlung, von der alle profitieren
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Sie haben, was jeder Energieanbieter sucht: das Vertrauen Ihrer Kunden. Genau das machen wir
              zu einem Vorteil für alle Beteiligten.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cards.map((c) => (
              <div key={c.title} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-ambient card-hover">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-brand/10">
                  <c.icon className="h-6 w-6 text-violet-brand" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-marine">{c.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ihre Vorteile als Berater */}
      <section className="section-spacing bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-brand">
              Ihr Vorteil als Berater
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-marine">
              Was Sie als Berater davon haben
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Energie ist kein Nebenprodukt, sondern ein Hebel für Ihr Kerngeschäft.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {beraterVorteile.map((v) => (
              <div key={v.title} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-ambient card-hover">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-brand/10">
                  <v.icon className="h-6 w-6 text-violet-brand" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-marine">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>

          {/* Highlight: freies Budget für Finanzprodukte */}
          <div className="mt-6 relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-10">
            <div
              className="absolute -bottom-24 -right-16 w-[26rem] h-[26rem] rounded-full opacity-50 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,240,255,0.25), transparent 60%)" }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <PiggyBank className="h-7 w-7 text-cyan-brand" />
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Freies Budget für Ihre Finanzprodukte
                </h3>
                <p className="mt-2 text-white/80 leading-relaxed max-w-3xl">
                  Der stärkste Hebel: Was Ihr Kunde bei Strom und Gas einspart, ist plötzlich frei. Aus einigen
                  Hundert Euro im Jahr wird Spielraum für einen Sparplan, eine zusätzliche Absicherung oder mehr
                  Vorsorge. Sie helfen beim Sparen und schaffen damit den Anlass für das nächste Finanzthema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* So funktioniert's */}
      <section id="ablauf" className="section-spacing bg-surface scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-marine">So funktioniert es</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-3xl bg-white border border-gray-100 p-7 shadow-ambient">
                <span className="absolute -top-4 left-7 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-bold text-marine">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warum Energie: dunkle Box */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-14">
            <div
              className="absolute -bottom-24 -right-20 w-[30rem] h-[30rem] rounded-full opacity-50 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,240,255,0.25), transparent 60%)" }}
            />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <Zap className="w-9 h-9 text-cyan-brand" />
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Warum Energie der perfekte Anlass ist
                </h2>
                <p className="mt-4 text-white/80 leading-relaxed">
                  Kaum ein Thema öffnet Türen so leicht. Energie betrifft jeden Haushalt und jedes Unternehmen,
                  die Kosten sind gerade Gesprächsthema, und der Nutzen steht am Ende schwarz auf weiß auf dem
                  Kontoauszug.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Betrifft jeden Kunden, unabhängig von Alter und Vertrag.",
                  "Konkurriert nicht mit Versicherung oder Finanzierung, sondern ergänzt sie.",
                  "Niedrige Hemmschwelle: Es geht ums Sparen, nicht um neue Verpflichtungen.",
                  "Messbarer Nutzen, den Ihr Kunde direkt spürt.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-white/90">
                    <Check className="w-5 h-5 shrink-0 text-cyan-brand mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transparenz */}
      <section className="section-spacing bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-brand/20 bg-white p-8 md:p-10 shadow-ambient">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-violet-brand" />
              <span className="text-sm font-semibold uppercase tracking-widest text-violet-brand">
                Ehrlich verkauft sich besser
              </span>
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-marine">
              Verschenken Sie Ihre Prämie sichtbar
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Der stärkste Zug ist nicht, die Vergütung zu verstecken, sondern sie offen weiterzugeben. Wenn
              Ihr Kunde erfährt, dass Sie Ihre Vermittlungsprämie in seinen Vorteil verwandeln, werden Sie vom
              Verkäufer zum Fürsprecher. Das bindet stärker als jeder heimliche Bonus, und es ist rechtlich
              sauber: Transparenz statt Verschleierung.
            </p>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Die Energievermittlung läuft über unsere Erlaubnis nach §34c GewO. Kundendaten verarbeiten wir
              nur mit Einverständnis und DSGVO-konform. Ihre Teilnahme ist freiwillig und jederzeit beendbar.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-marine mb-8">Häufige Fragen von Partnern</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.frage} className="group rounded-2xl border border-gray-100 bg-white shadow-ambient">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-marine list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.frage}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-violet-brand transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed">{f.antwort}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-12 text-center">
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full opacity-60 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(123,97,255,0.35), transparent 60%)" }}
            />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Werden Sie Plasma-Partner
              </h2>
              <p className="mt-3 text-white/80 max-w-2xl mx-auto leading-relaxed">
                Lassen Sie uns unverbindlich sprechen. Wir zeigen Ihnen, wie einfach Sie Energie in Ihr
                Kundengespräch einbauen, und klären Vergütung und Ablauf persönlich.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-brand px-6 py-3 font-semibold text-white shadow-violet-glow transition-transform hover:scale-[1.03]"
                >
                  Partnergespräch anfragen <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={company.phone.href}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" /> {company.phone.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
