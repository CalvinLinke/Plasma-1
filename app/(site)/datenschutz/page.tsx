export default function Datenschutz() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Rechtliches</p>
          <h1 className="text-4xl font-bold text-marine mb-3">Datenschutzerklärung</h1>
          <p className="text-sm text-gray-400">Stand: Juni 2025 · gemäß DSGVO, BDSG und TMG</p>
        </div>

        <div className="space-y-10">

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">1. Verantwortlicher</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und sonstiger datenschutzrechtlicher Bestimmungen ist:<br /><br />
              Plasma Energie Solution<br />
              Jörg Hermann (Geschäftsführer)<br />
              Grüne Straße 13b, 01067 Dresden<br />
              Telefon: +49 172 8182583<br />
              E-Mail: box@plasma-energie.de
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">2. Grundsätze der Datenverarbeitung</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienstleistungen, zur Erfüllung gesetzlicher Verpflichtungen oder auf Grundlage einer Einwilligung erforderlich ist. Die Verarbeitung erfolgt stets gemäß den Grundsätzen der DSGVO (Rechtmäßigkeit, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung, Integrität und Vertraulichkeit).
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Rechtsgrundlagen der Verarbeitung sind insbesondere:
            </p>
            <ul className="text-gray-600 text-sm leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung / vorvertragliche Maßnahmen)</li>
              <li>Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Verpflichtung)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">3. Bereitstellung der Website / Server-Logfiles</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Beim Aufrufen unserer Website werden durch den Browser des Nutzers automatisch Informationen an den Server unserer Website übermittelt. Diese Informationen werden temporär in sogenannten Server-Logfiles gespeichert:
            </p>
            <ul className="text-gray-600 text-sm leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>IP-Adresse des anfragenden Rechners</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name und URL der abgerufenen Datei</li>
              <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
              <li>Verwendeter Browser und ggf. das Betriebssystem</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am ordnungsgemäßen Betrieb). Die Daten werden nach spätestens 30 Tagen gelöscht.<br /><br />
              <strong>Hosting:</strong> Diese Website wird bei Vercel Inc., 340 Pine Street Suite 601, San Francisco, CA 94104, USA gehostet. Vercel verarbeitet Verbindungsdaten auf ihren Servern. Mit Vercel besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Der Datentransfer in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">4. Kontaktformular</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Wenn Sie uns über das Kontaktformular auf unserer Website kontaktieren, werden folgende Daten erhoben:
            </p>
            <ul className="text-gray-600 text-sm leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Ihre Nachricht</li>
              <li>Optionaler Grund der Kontaktaufnahme</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen). Die Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben. Sobald Ihre Anfrage abschließend bearbeitet ist, werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">5. Angebot anfordern / Datei-Upload (Energierechnungen)</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Zur Erstellung eines individuellen Energieangebots bieten wir die Möglichkeit, Energierechnungen (Strom- und/oder Gasrechnung) hochzuladen. Dabei können folgende personenbezogene Daten verarbeitet werden:
            </p>
            <ul className="text-gray-600 text-sm leading-relaxed mt-2 space-y-1 list-disc list-inside">
              <li>Name und Adresse des Anschlussnehmers</li>
              <li>Zählernummer / Zählpunktnummer (ZP)</li>
              <li>Verbrauchsdaten (kWh/Jahr)</li>
              <li>Aktueller Energieanbieter und Tarif</li>
              <li>Abschlagsbetrag und Rechnungsbetrag</li>
              <li>Weitere auf der Rechnung enthaltene Angaben</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              <strong>Zweck:</strong> Die übermittelten Daten werden ausschließlich zur Analyse des bestehenden Tarifs, zum Vergleich mit verfügbaren Angeboten und zur Erstellung eines konkreten Angebots an Sie verwendet.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen auf Anfrage der betroffenen Person) sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch aktives Hochladen der Datei).
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              <strong>Datenweitergabe an Energieanbieter:</strong> Sofern Sie sich für einen Tarifwechsel entscheiden und uns beauftragen, den Wechselprozess zu übernehmen, werden die für den Vertragsabschluss erforderlichen Daten an den jeweiligen Energieanbieter übermittelt. Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und ausdrücklich nur nach Ihrer Zustimmung.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              <strong>Speicherdauer:</strong> Hochgeladene Dokumente und die darin enthaltenen Daten werden nach Abschluss des Beratungsprozesses oder spätestens nach 90 Tagen ohne weitere Aktivität gelöscht, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht (z. B. handels- oder steuerrechtliche Aufbewahrungsfristen von bis zu 10 Jahren für vertragsrelevante Unterlagen).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">6. Google Maps</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Auf unserer Kontaktseite verwenden wir Google Maps, einen Kartendienst der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA (bzw. Google Ireland Limited für Nutzer im EWR). Wenn Sie unsere Kontaktseite aufrufen, stellt Ihr Browser eine Verbindung zu den Servern von Google her. Dabei kann Google Ihre IP-Adresse und Informationen über Ihren Browser erfassen.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Darstellung unseres Standortes). Der Datentransfer in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Weitere Informationen zur Datenverarbeitung durch Google finden Sie unter: https://policies.google.com/privacy
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">7. Cookies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Unsere Website verwendet technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind. Diese Cookies speichern keine personenbezogenen Daten und werden nach Ende der Browsersitzung gelöscht. Eine Einwilligung ist für technisch notwendige Cookies gemäß § 25 Abs. 2 TTDSG nicht erforderlich. Wir verwenden keine Tracking- oder Analyse-Cookies von Drittanbietern.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">8. Datensicherheit</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen Verlust, Manipulation und unberechtigten Zugriff zu schützen. Die Übertragung zwischen Ihrem Browser und unseren Servern erfolgt verschlüsselt über HTTPS (TLS). Hochgeladene Dokumente werden ausschließlich auf gesicherten Servern gespeichert und sind nur autorisierten Mitarbeitern zugänglich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">9. Ihre Rechte als betroffene Person</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:
            </p>
            <ul className="text-gray-600 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO): Sie können Auskunft über die von uns verarbeiteten Daten verlangen.</li>
              <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
              <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
              <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
              <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO): Sie können der Verarbeitung Ihrer Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO jederzeit widersprechen.</li>
              <li><strong>Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO): Eine erteilte Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden.</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: box@plasma-energie.de
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">10. Beschwerderecht bei der Aufsichtsbehörde</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sie haben das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:<br /><br />
              Sächsischer Datenschutz- und Transparenzbeauftragter (SDTB)<br />
              Devrientstraße 5, 01067 Dresden<br />
              E-Mail: saechsdsb@slt.sachsen.de<br />
              Web: https://www.datenschutz.sachsen.de
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-marine mb-4 pb-2 border-b border-gray-100">11. Aktualität und Änderungen</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen unserer Datenverarbeitungspraktiken oder bei Änderungen der gesetzlichen Anforderungen anzupassen. Die jeweils aktuelle Fassung ist auf dieser Seite abrufbar. Stand: Juni 2025.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
