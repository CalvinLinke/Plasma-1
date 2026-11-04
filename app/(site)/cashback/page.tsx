import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Calculator,
  FileText,
  Wallet,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  BadgeCheck,
  Clock,
  Euro,
  Ban,
  Phone,
  MessageCircle,
  Check,
} from "lucide-react";
import AngebotForm from "@/components/AngebotForm";
import CashbackFlow from "@/components/cashback/CashbackFlow";
import { cashbackConfig, normalisiereCode, normalisiereQuelle } from "@/lib/cashback/config";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "50 € Cashback für Ihren Stromwechsel",
  description:
    "Stromvertrag mit Plasma wechseln und 50 € bekommen. Postleitzahl eingeben, Preis sofort sehen, online abschließen. Auszahlung nach Start Ihres neuen Vertrags. Kostenlos und ohne Vorkosten.",
  alternates: { canonical: "/cashback" },
};

const WHATSAPP =
  "https://wa.me/491728182583?text=" +
  encodeURIComponent(
    "Hallo Plasma, ich habe den 50-Euro-Flyer und moechte meinen Stromvertrag wechseln.",
  );
const TEL = "tel:+491728182583";

// Bullet-Punkte im Hero
const heroBullets = [
  "Preis sofort sehen, online abschließen",
  "Ihren alten Vertrag kündigt der neue Versorger",
  "Echter Ansprechpartner aus Dresden, kein Callcenter",
];

// Ablauf in 3 Schritten
const steps = [
  {
    icon: Calculator,
    titel: "Preis berechnen",
    text: "Postleitzahl und Personen im Haushalt eingeben. Ihr neuer Preis steht sofort da.",
  },
  {
    icon: FileText,
    titel: "Online abschließen",
    text: "Daten von Ihrer Stromrechnung abtippen: Kundennummer, Zählernummer, Marktlokations-ID, Verbrauch. Dazu Ihre IBAN. Kein Papier, keine Unterschrift.",
  },
  {
    icon: Wallet,
    titel: "50 € bekommen",
    text: "Der neue Versorger übernimmt den Wechsel. Sobald Ihr neuer Vertrag läuft, überweisen wir Ihnen 50 €.",
  },
];

// Vorteile
const vorteile = [
  {
    icon: Euro,
    titel: "50 € für Sie",
    text: "Sie bekommen 50 € auf Ihr Konto überwiesen. Das ist unser Dankeschön, wenn Sie über uns wechseln.",
  },
  {
    icon: HeartHandshake,
    titel: "Kein Aufwand für Sie",
    text: "Wir kündigen Ihren alten Vertrag und melden den neuen an. Sie müssen sich um nichts kümmern.",
  },
  {
    icon: ShieldCheck,
    titel: "Kostenlos und ohne Risiko",
    text: "Sie zahlen uns nichts. Es gibt keine versteckten Kosten und keinen Vertragszwang.",
  },
  {
    icon: MapPin,
    titel: "Menschen aus Dresden",
    text: "Bei uns spricht ein echter Mensch mit Ihnen. Kein Callcenter, keine Warteschleife.",
  },
  {
    icon: BadgeCheck,
    titel: "Meist günstigerer Tarif",
    text: "Wir schauen, ob es für Sie einen günstigeren Stromtarif gibt. Wenn ja, sparen Sie jeden Monat.",
  },
  {
    icon: Check,
    titel: "Sie entscheiden",
    text: "Erst sehen Sie den Preis. Bestellt wird nur, wenn Sie selbst auf Bestellen tippen.",
  },
];

// FAQ (auch als FAQPage-Schema)
const faqs = [
  {
    frage: "Kostet mich das etwas?",
    antwort:
      "Nein. Unser Service ist für Sie komplett kostenlos. Sie zahlen keine Gebühr und gehen kein Risiko ein. Ihre 50 € bekommen Sie zusätzlich obendrauf.",
  },
  {
    frage: "Wann bekomme ich die 50 €?",
    antwort:
      "Sobald Ihr neuer Stromvertrag läuft, also ab dem ersten Tag der Belieferung. Danach überweisen wir Ihnen die 50 € innerhalb von 6 Wochen auf Ihr Konto. Vorher wird nichts ausgezahlt, weil erst dann alles feststeht.",
  },
  {
    frage: "Muss ich meinen alten Vertrag selbst kündigen?",
    antwort:
      "Nein. Beim Wechsel kündigt der neue Versorger Ihren alten Vertrag. Dafür braucht er Ihre Kundennummer und die Zählernummer von der Rechnung. Die Kündigungsfrist Ihres alten Vertrags gilt weiter, in der Grundversorgung sind es zwei Wochen. Haben Sie schon selbst gekündigt, nennen Sie uns einfach den Tag, ab dem geliefert werden soll.",
  },
  {
    frage: "Muss ich etwas unterschreiben?",
    antwort:
      "Nein. Ein Stromvertrag braucht keine Unterschrift. Sie bestellen online, der neue Versorger schickt Ihnen die Vertragsbestätigung per E-Mail. Darin stehen auch alle Bedingungen und Ihr Widerrufsrecht.",
  },
  {
    frage: "Welche Angaben brauche ich?",
    antwort:
      "Ihre letzte Stromrechnung reicht. Daraus brauchen wir Ihren bisherigen Versorger, Ihre Kundennummer dort, die Zählernummer, die Marktlokations-ID und den Jahresverbrauch. Damit meldet der neue Versorger Sie an und kündigt den alten Vertrag. Dazu Ihre IBAN für die monatlichen Abschläge. Auf dasselbe Konto überweisen wir die 50 €.",
  },
  {
    frage: "Woher kommen die 50 €?",
    antwort:
      "Wenn Sie über uns wechseln, bekommen wir vom neuen Anbieter eine Vergütung. Einen Teil davon geben wir an Sie weiter. So einfach ist das. Für Sie bleibt es kostenlos.",
  },
  {
    frage: "Was ist, wenn ich es mir anders überlege?",
    antwort:
      "Kein Problem. Sie sehen zuerst das Angebot und entscheiden in Ruhe. Nach einem Wechsel haben Sie außerdem 14 Tage Widerrufsrecht. Sie gehen also kein Risiko ein.",
  },
  {
    frage: "Ich kenne mich mit so etwas nicht aus.",
    antwort:
      "Das ist in Ordnung. Statt online abzuschließen, können Sie uns auch einfach ein Foto Ihrer Rechnung schicken. Dann melden wir uns innerhalb von 48 Stunden. Oder Sie rufen an oder schreiben per WhatsApp. Wir erklären Ihnen alles in Ruhe und in einfacher Sprache.",
  },
];

type PageProps = {
  // Next.js 16: searchParams ist ein Promise und muss awaited werden.
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Cashback({ searchParams }: PageProps) {
  // Verteilgebiet aus dem Flyer-QR (?f=gorbitz). Nur zur Zuordnung des
  // Rücklaufs, daher hart auf harmlose Zeichen begrenzt.
  const sp = (await searchParams) ?? {};
  const rawF = Array.isArray(sp.f) ? sp.f[0] : sp.f;
  const rawCode = Array.isArray(sp.code) ? sp.code[0] : sp.code;
  const gebiet = normalisiereQuelle(rawF);
  const code = normalisiereCode(rawCode);
  const { betragEur } = cashbackConfig();

  return (
    <>
      <SchemaOrg type="FAQPage" data={{ faqs }} />

      {/* HERO: Versprechen links, Tarif-Strecke rechts */}
      <header
        className="relative overflow-hidden border-b border-gray-100"
        style={{ background: "linear-gradient(160deg, #EDE9FF 0%, #FFFFFF 45%, #E5F8FF 100%)" }}
      >
        <div
          className="absolute -top-40 -right-24 w-[34rem] h-[34rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(123,97,255,0.28), transparent 70%)" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 lg:pt-32 lg:pb-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-start">
            {/* Linke Spalte: Versprechen */}
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 rounded-full bg-marine/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-brand">
                Aktion · Code {code}
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-marine leading-[1.1]">
                Strom wechseln und{" "}
                <span className="text-gradient">{betragEur} € bekommen.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl">
                Postleitzahl eingeben, Preis sofort sehen, online abschließen. Sobald Ihr neuer
                Vertrag läuft, überweisen wir Ihnen {betragEur} €. Kostenlos und ohne Vorkosten.
              </p>

              {/* Gutschein-Optik, greift den Flyer auf */}
              <div className="mt-8 hidden max-w-sm rounded-3xl border-2 border-dashed border-violet-brand/40 bg-white/70 p-6 shadow-ambient lg:block">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-brand">
                  Ihr Gutschein
                </p>
                <p className="mt-1 text-6xl font-extrabold leading-none text-gradient">{betragEur} €</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span>Aktionscode</span>
                  <span className="rounded-lg bg-marine px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-white">
                    {code}
                  </span>
                </div>
              </div>

              <ul className="mt-8 hidden space-y-3 lg:block">
                {heroBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-brand/20">
                      <Check className="h-3.5 w-3.5 text-marine" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] font-medium text-marine">{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-gray-500">
                Lieber ohne Tippen?{" "}
                <a href="#foto" className="font-semibold text-violet-brand underline underline-offset-2">
                  Rechnung als Foto schicken
                </a>
              </p>
            </div>

            {/* Rechte Spalte: Tarif berechnen und abschließen */}
            <div>
              <CashbackFlow code={code} quelle={gebiet} betragEur={betragEur} />
            </div>
          </div>
        </div>
      </header>

      {/* SO EINFACH GEHT DAS */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-marine text-center">
            So einfach geht das
          </h2>
          <p className="mt-3 text-center text-gray-500">Drei Schritte. Mehr müssen Sie nicht tun.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.titel}
                className="relative rounded-3xl border border-gray-100 bg-surface p-6 shadow-ambient"
              >
                <span className="absolute right-5 top-5 text-4xl font-extrabold text-violet-brand/15">
                  {i + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-brand/10">
                  <s.icon className="h-6 w-6 text-violet-brand" />
                </span>
                <h3 className="mt-4 font-bold text-marine">{s.titel}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WANN BEKOMME ICH DIE 50 € — glasklar erklärt */}
      <section className="bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="rounded-3xl bg-brand-gradient p-8 md:p-12 text-white shadow-ambient-md">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-cyan-brand" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Wann bekomme ich die 50 €?
              </h2>
            </div>
            <p className="mt-4 text-white/80 leading-relaxed max-w-2xl">
              Ganz klar und ehrlich: Die 50 € gibt es, sobald Ihr neuer Stromvertrag läuft. Also ab
              dem Tag, an dem Ihr neuer Anbieter Sie mit Strom beliefert. Vorher zahlen wir nichts
              aus, weil erst dann alles sicher ist. So bekommen Sie am Ende wirklich Ihr Geld.
            </p>
            <ol className="mt-8 space-y-4">
              {[
                "Sie berechnen Ihren Preis und bestellen online. Oder Sie schicken uns ein Foto Ihrer Rechnung.",
                "Der neue Versorger bestätigt Ihnen den Vertrag per E-Mail.",
                "Ihr neuer Vertrag startet. Ab hier läuft Ihr Strom über den neuen Anbieter.",
                "Wir überweisen Ihnen 50 € innerhalb von 6 Wochen nach diesem Start.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-cyan-brand ring-1 ring-white/20">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-[15px] leading-relaxed text-white/90">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FOTO-WEG: für alle, die nicht tippen möchten */}
      <section id="foto" className="bg-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-brand/10">
                <Camera className="h-6 w-6 text-violet-brand" />
              </span>
              <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-marine">
                Lieber ohne Tippen? Foto genügt.
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Fotografieren Sie Ihre letzte Stromrechnung und laden Sie das Bild hier hoch. Wir
                suchen den Tarif für Sie heraus und melden uns innerhalb von 48 Stunden. Die {betragEur} €
                gibt es auf diesem Weg genauso.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Oder per E-Mail an{" "}
                <a href="mailto:cashback@plasma-energie.de" className="font-semibold text-violet-brand">
                  cashback@plasma-energie.de
                </a>
                .
              </p>
            </div>
            <AngebotForm
              aktion="cashback"
              gebiet={gebiet ? `${code} · ${gebiet}` : code}
              submitLabel={`Rechnung senden und ${betragEur} € sichern`}
              successNote={
                <>
                  <strong className="text-marine">Ihre {betragEur} €:</strong> Sobald Ihr neuer Stromvertrag
                  läuft, überweisen wir Ihnen die {betragEur} € innerhalb von 6 Wochen.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* DAS HABEN SIE DAVON */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-marine text-center">
            Das haben Sie davon
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vorteile.map((v) => (
              <div
                key={v.titel}
                className="rounded-3xl border border-gray-100 bg-surface p-6 shadow-ambient card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-brand/15">
                  <v.icon className="h-5 w-5 text-marine" />
                </span>
                <h3 className="mt-4 font-bold text-marine">{v.titel}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IST DAS SERIÖS — Vertrauen */}
      <section className="bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-ambient">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-marine">
              Ist das wirklich seriös?
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Eine berechtigte Frage. Deshalb sagen wir es klar: Wir sind Plasma Energie Solution aus
              Dresden. Wir helfen Menschen dabei, einen besseren Stromvertrag zu finden. Wenn Sie über
              uns wechseln, zahlt uns der neue Anbieter eine Vergütung. Einen festen Teil davon, die
              50 €, geben wir an Sie weiter. Für Sie bleibt alles kostenlos.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Kostenlos und unverbindlich", "Sie zahlen uns nichts und müssen zu nichts Ja sagen."],
                ["14 Tage Widerrufsrecht", "Nach einem Wechsel können Sie es sich noch anders überlegen."],
                ["Persönlicher Ansprechpartner", "Ein echter Mensch aus Dresden, kein Callcenter."],
                ["Feste Adresse, klare Angaben", "Grüne Straße 13b, 01067 Dresden. Sie erreichen uns jederzeit."],
              ].map(([t, s]) => (
                <div key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-brand/20">
                    <Check className="h-4 w-4 text-marine" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-semibold text-marine text-[15px]">{t}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{s}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-gray-500">
              <strong className="text-marine">748 Anschlüsse</strong> haben mit uns bereits nachweislich
              gespart.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-marine text-center">
            Häufige Fragen
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.frage}
                className="group rounded-2xl border border-gray-100 bg-surface p-5 shadow-ambient [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-marine">
                  {f.frage}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-brand/10 text-violet-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{f.antwort}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT-HELFER — nur falls Fragen */}
      <section className="bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-ambient">
            <h2 className="text-xl md:text-2xl font-bold text-marine">
              Sie haben eine Frage oder kommen nicht weiter?
            </h2>
            <p className="mt-2 text-gray-500">
              Rufen Sie uns an oder schreiben Sie per WhatsApp. Wir erklären Ihnen alles in Ruhe.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-marine px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-5 w-5" /> Per WhatsApp schreiben
              </a>
              <a
                href={TEL}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-marine transition-colors hover:border-violet-brand/40 hover:text-violet-brand"
              >
                <Phone className="h-5 w-5" /> 0172 8182583
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BEDINGUNGEN — UWG-Transparenz, vollständig */}
      <section id="bedingungen" className="bg-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400">
            <Ban className="h-4 w-4" /> Bedingungen zur 50-€-Aktion
          </h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            Die 50 € Cashback gibt es einmal pro Haushalt und Stromzähler, wenn Sie über die Plasma
            Energie Solution einen neuen Stromvertrag abschließen. Die Auszahlung erfolgt per
            Überweisung innerhalb von 6 Wochen nach erfolgtem Lieferbeginn Ihres neuen Vertrags. Es
            gibt keine Barauszahlung. Wir überweisen auf das Konto, das Sie bei der Bestellung angegeben haben. Die Annahme durch den Energieversorger steht unter Vorbehalt,
            zum Beispiel bei der üblichen Bonitätsprüfung. Wir prüfen für Sie, welcher Wechsel möglich
            ist, und sagen Ihnen offen, wenn etwas nicht klappt. Diese Aktion ist Werbung der Plasma
            Energie Solution.
          </p>
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            Plasma Energie Solution · Grüne Straße 13b, 01067 Dresden · +49 172 8182583 ·
            box@plasma-energie.de · plasma-energie.de
          </p>
        </div>
      </section>
    </>
  );
}
