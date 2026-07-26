import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum und Anbieterkennzeichnung der Plasma Energie Solutions UG (haftungsbeschränkt), Dresden.",
  alternates: { canonical: "/impressum" },
};

export default function Impressum() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Rechtliches</p>
          <h1 className="text-4xl font-bold text-marine mb-3">Impressum</h1>
          <p className="text-sm text-gray-400">Angaben gemäß § 5 TMG</p>
        </div>

        <div className="prose-legal">

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Anbieter</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Plasma Energie Solutions UG (haftungsbeschränkt)<br />
              Grüne Straße 13 b<br />
              01067 Dresden<br />
              Deutschland
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Geschäftsführung</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Jörg Hermann
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Kontakt</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Telefon: +49 172 8182583<br />
              E-Mail: box@plasma-energie.de
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Registereintrag</h2>
            <p className="text-gray-600 leading-relaxed">
              Eintragung im Handelsregister<br />
              Registergericht: Amtsgericht Dresden<br />
              Registernummer: HRB 45616
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Steuerliche Angaben</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Steuernummer: 203/116/00304<br />
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE369748497
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Berufsbezeichnung und Tätigkeit</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Die Plasma Energie Solutions UG (haftungsbeschränkt) ist ein unabhängiger Energievermittler für Strom- und Gasverträge. Die Vermittlungstätigkeit erfolgt auf Grundlage der gewerberechtlichen Zulassung nach § 34c GewO bzw. den einschlägigen gewerberechtlichen Vorschriften.<br /><br />
              Zuständige Aufsichtsbehörde: Gewerbeamt der Landeshauptstadt Dresden
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Jörg Hermann<br />
              Grüne Straße 13b<br />
              01067 Dresden
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Haftung für Inhalte</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Haftung für Links</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Urheberrecht</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">Streitschlichtung</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
