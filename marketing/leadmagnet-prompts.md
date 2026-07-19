# Lead-Magnet-Prompts für Claude Design — Plasma Energie Solution

Jeder Lead-Magnet ist auf der Website bereits verdrahtet (Download-Button auf der Zielseite + auf `/vorlagen`). Erzeuge das finale Asset in **Claude Design** und speichere es als HTML (oder exportiere als PDF) **exakt unter dem angegebenen Dateipfad** in `public/downloads/`, dann ersetzt es automatisch den Platzhalter.

## Gemeinsame CI-Vorgabe (in jeden Prompt übernehmen)

> **Plasma-CI:** Hauptfarben Marine `#1A1B4B`, Indigo `#4B0082`, Violett `#7B61FF`, Cyan `#00F0FF`. Signatur-Verlauf `linear-gradient(135deg,#4B0082,#1A1B4B)`. Logo = abgerundetes Quadrat mit Violett-Cyan-Verlauf und weißem „P". Schrift: Inter / serifenlose System-Sans. Format **A4 Hochformat, druckoptimiert** (`@media print` sauber). Kopf: Verlaufs-Header mit Logo + Titel. Fuß: helle Fußzeile mit NAP „Plasma Energie Solution · Grüne Straße 13b, 01067 Dresden · +49 172 8182583 · box@plasma-energie.de · plasma-energie.de". Am Ende eine dezente CTA-Box: **„Keine Lust auf Papierkram? Rechnung hochladen, wir übernehmen den Rest → plasma-energie.de/angebot-erhalten"**. Tonalität: Sie-Form, sachlich, freundlich, **keine Gedankenstriche im Text** (Komma/Punkt/Doppelpunkt). Bei Musterbriefen und Vorlagen den Hinweis „unverbindliche Muster-Vorlage, keine Rechtsberatung" in die Fußzeile.

---

## 1. Umzugs-Checkliste Energie *(vorhanden)*
- **Datei:** `public/downloads/umzugs-checkliste-energie.html` · **Zielseite:** `/wechseln/umzug-strom-gas-ummelden` · **Format:** PDF/Checkliste
- **Prompt:** „Erstelle eine druckbare A4-Checkliste ‚Umzugs-Checkliste: Strom & Gas' im Plasma-CI (siehe oben). Drei Abschnitte mit abhakbaren Kästchen: ‚2 bis 6 Wochen vor dem Umzug' (Kündigungsfrist prüfen, prüfen ob Anbieter mitzieht, neuen Tarif wählen statt Grundversorgung, Sonderkündigungsrecht prüfen), ‚Am Umzugstag' (End- und Anfangszählerstände Strom und Gas mit Foto, Zählernummern notieren), ‚Nach dem Umzug' (alten Anbieter abmelden, Zählerstände melden, Abschlag anpassen, Schlussrechnung prüfen). Danach ein Ausfüll-Block ‚Meine Zählerstände' mit vier beschreibbaren Feldern. CI-Header, NAP-Fuß, CTA-Box."

## 2. Übergabeprotokoll Zählerstände *(vorhanden)*
- **Datei:** `public/downloads/uebergabeprotokoll-zaehlerstaende.html` · **Zielseite:** `/ratgeber/zaehlerstand-ablesen-uebergabe` · **Format:** PDF/Formular
- **Prompt:** „Erstelle ein druckbares A4-Übergabeprotokoll für Zählerstände im Plasma-CI. Kopfblock mit Feldern Objekt/Adresse, Datum der Übergabe, übergebende und übernehmende Person. Danach je eine Tabelle für Strom (Zählernummer, Zählerstand kWh, Tarif/HT-NT), Gas (Zählernummer, Zählerstand m³, Bemerkung) und optionale weitere Zähler. Zwei Unterschriftslinien. Hinweiszeile ‚Zähler mit Zählernummer und Datum fotografieren'. CI-Header, NAP-Fuß."

## 3. Kündigungsvorlage Strom & Gas *(vorhanden)*
- **Datei:** `public/downloads/kuendigung-strom-gas-vorlage.html` · **Zielseite:** `/ratgeber/stromvertrag-kuendigen-fristen` · **Format:** PDF/Musterbrief
- **Prompt:** „Erstelle einen ausfüllbaren A4-Musterbrief ‚Kündigung Strom & Gas' im Plasma-CI. Hinweisbox oben zur Nutzung (Platzhalter in Klammern ersetzen, Sonderkündigungsrecht bei Preiserhöhung/Umzug nennen). Briefkörper mit Platzhaltern für Absender, Empfänger (Anbieter), Ort/Datum, Kunden- und Zählernummer, Kündigungstext ‚fristgerecht zum nächstmöglichen Termin' plus optionaler Sonderkündigungs-Absatz, Bitte um Bestätigung mit Vertragsende, Unterschriftslinie. Fußzeile mit ‚unverbindliche Muster-Vorlage, keine Rechtsberatung' + NAP."

---

## 4. Musterbrief Widerspruch Preiserhöhung
- **Datei:** `public/downloads/widerspruch-preiserhoehung.html` · **Zielseite:** `/wechseln/preiserhoehung-anbieter-wechseln` · **Format:** PDF/Musterbrief
- **Prompt:** „Erstelle einen ausfüllbaren A4-Musterbrief ‚Widerspruch gegen die Preiserhöhung' (Strom/Gas) im Plasma-CI. Kurze Hinweisbox: Widerspruch verschafft Zeit, gleichzeitig besteht meist ein Sonderkündigungsrecht. Briefkörper mit Platzhaltern (Absender, Anbieter, Kunden-/Zählernummer, Datum der Preisankündigung), Text: der angekündigten Preiserhöhung wird widersprochen, Bitte um schriftliche Bestätigung des bisherigen Preises bzw. Hinweis auf Sonderkündigungsrecht, Fristsetzung. Unterschriftslinie. CTA-Box: statt selbst kämpfen, Rechnung hochladen und Wechsel prüfen lassen. Fuß: Muster-Hinweis + NAP."

## 5. Musterbrief Sonderkündigung (Preiserhöhung/Umzug)
- **Datei:** `public/downloads/sonderkuendigung-strom-gas.html` · **Zielseite:** Bibliothek `/vorlagen` (+ Verweis Preiserhöhung/Umzug) · **Format:** PDF/Musterbrief
- **Prompt:** „Erstelle einen A4-Musterbrief ‚Sonderkündigung Strom/Gas' im Plasma-CI, zwei Varianten in einem Dokument (Auswahl ankreuzbar): wegen Preiserhöhung und wegen Umzug. Platzhalter für Absender, Anbieter, Kunden-/Zählernummer, Kündigungsdatum/Grund. Text mit Berufung auf das gesetzliche Sonderkündigungsrecht, Bitte um Bestätigung des Vertragsendes und Endabrechnung. Unterschriftslinie. Fuß: Muster-Hinweis + NAP, CTA-Box zum Upload."

## 6. Vollmacht zur Anbieterummeldung
- **Datei:** `public/downloads/vollmacht-anbieterwechsel.html` · **Zielseite:** `/ratgeber/stromanbieter-wechseln` · **Format:** PDF/Vollmacht
- **Prompt:** „Erstelle eine A4-Vollmacht ‚Vollmacht zur Anbieterummeldung und Kündigung' im Plasma-CI. Felder: Vollmachtgeber (Name, Adresse, Kunden-/Zählernummer), Bevollmächtigter (vorbefüllt: Plasma Energie Solution). Text: bevollmächtigt zur Kündigung des bestehenden Strom-/Gasvertrags, Anmeldung beim neuen Anbieter und Kommunikation mit den beteiligten Parteien, jederzeit widerrufbar. Ort/Datum, Unterschriftslinie. Fuß: Datenschutzhinweis (nur mit Einwilligung, DSGVO) + NAP."

## 7. „Stromrechnung in 5 Minuten prüfen"-Checkliste
- **Datei:** `public/downloads/stromrechnung-pruefen-checkliste.html` · **Zielseite:** `/ratgeber/energiepreise-verstehen` · **Format:** PDF/Checkliste
- **Prompt:** „Erstelle eine A4-Checkliste ‚Ihre Stromrechnung in 5 Minuten prüfen' im Plasma-CI. Abhakbare Punkte mit kurzer Erklärung: Zählernummer und Zählpunkt korrekt, Arbeitspreis (ct/kWh) und Grundpreis (Euro/Jahr) getrennt betrachten, Jahresverbrauch plausibel, Bonus nur im ersten Jahr, Preisgarantie und Laufzeit, Abschlag zum Verbrauch passend, Grundversorgung erkannt. Kleine Infografik ‚so setzt sich der Preis zusammen'. CTA-Box: zu kompliziert? Rechnung hochladen, wir prüfen kostenlos. NAP-Fuß."

## 8. Widerspruch fehlerhafte Jahresabrechnung
- **Datei:** `public/downloads/widerspruch-jahresabrechnung.html` · **Zielseite:** `/ratgeber/abschlag-nachzahlung-verstehen` · **Format:** PDF/Musterbrief + Checkliste
- **Prompt:** „Erstelle ein A4-Dokument ‚Fehlerhafte Jahresabrechnung: prüfen & widersprechen' im Plasma-CI. Teil 1: kurze Prüf-Checkliste (Abrechnungszeitraum, Anfangs-/Endzählerstand, geschätzt vs. abgelesen, Abschläge korrekt verrechnet, Preisbestandteile). Teil 2: ausfüllbarer Musterbrief Widerspruch mit Platzhaltern (Absender, Anbieter, Rechnungs-/Kundennummer, beanstandeter Punkt), Bitte um Korrektur und Neuberechnung, Fristsetzung, Unterschrift. Fuß: Muster-Hinweis + NAP, CTA-Box."

## 9. Abschlags-Anpassungs-Vorlage
- **Datei:** `public/downloads/abschlag-anpassen-vorlage.html` · **Zielseite:** Bibliothek `/vorlagen` · **Format:** PDF/Musterbrief
- **Prompt:** „Erstelle einen A4-Musterbrief ‚Anpassung des monatlichen Abschlags' im Plasma-CI, für zu hohe oder zu niedrige Abschläge (ankreuzbar). Platzhalter für Absender, Anbieter, Kunden-/Zählernummer, gewünschter neuer Abschlag, aktueller Jahresverbrauch. Text: Bitte um Anpassung auf einen realistischen Betrag, Hinweis auf tatsächlichen Verbrauch. Unterschrift. CTA-Box: hoher Abschlag ist oft ein Zeichen für einen teuren Tarif, Rechnung hochladen und vergleichen. NAP-Fuß."

## 10. Gewerbe-Energiekosten-Check (Tabelle)
- **Datei:** `public/downloads/gewerbe-energiekosten-check.html` · **Zielseite:** `/tarife/gewerbestrom` · **Format:** Druckbare Tabelle (optional echte .xlsx)
- **Prompt:** „Erstelle eine A4-Arbeitstabelle ‚Gewerbe-Energiekosten-Check' im Plasma-CI zum Ausfüllen (druckbar). Spalten: Standort, Jahresverbrauch kWh (Strom/Gas), aktueller Arbeitspreis, aktueller Grundpreis, Jahreskosten, Vertragsende, Kündigungsfrist. Summenzeile. Kurzer Erklärkasten SLP vs. RLM (Grenze ~100.000 kWh). CTA-Box: Werte eintragen, dann Rechnungen hochladen für ein konkretes Angebot. NAP-Fuß. (Alternativ als echte Excel-Datei mit denselben Spalten und Auto-Summe.)"

## 11. WG-Stromkosten-Aufteilung (Tabelle)
- **Datei:** `public/downloads/wg-stromkosten-aufteilung.html` · **Zielseite:** `/wechseln/wg-gruendung-strom-anmelden` · **Format:** Druckbare Tabelle (optional .xlsx)
- **Prompt:** „Erstelle eine A4-Vorlage ‚WG-Stromkosten fair aufteilen' im Plasma-CI. Tabelle mit Mitbewohner-Zeilen und Spalten: Person, Zimmergröße/Anteil, Anwesenheit, Sonderverbraucher, Anteil in Prozent, Betrag. Drei Aufteilungsmodelle kurz erklärt (pro Kopf, nach Fläche, nach Verbrauch/Zwischenzähler). Summenzeile. NAP-Fuß, CTA-Box."

## 12. Ökostrom-Siegel-Spickzettel
- **Datei:** `public/downloads/oekostrom-siegel-spickzettel.html` · **Zielseite:** `/tarife/oekostrom` · **Format:** PDF/1-Pager
- **Prompt:** „Erstelle einen A4-Spickzettel ‚Echten Ökostrom erkennen' im Plasma-CI. Vergleichstabelle: reiner Herkunftsnachweis-Tarif vs. echter Ökostrom mit Label (Stromquelle, fördert Anlagen-Neubau, unabhängiges Siegel, Wirkung). Kurze Erklärkarten zu ‚Grüner Strom Label' und ‚ok-power'. Merksatz ‚auf das Siegel achten, nicht nur auf das Wort Öko'. NAP-Fuß, CTA-Box."

## 13. Erste-Wohnung-Energie-Starterpaket
- **Datei:** `public/downloads/erste-wohnung-energie-starterpaket.html` · **Zielseite:** `/wechseln/erste-eigene-wohnung-strom-anmelden` · **Format:** PDF/Guide + Checkliste
- **Prompt:** „Erstelle einen A4-Guide ‚Erste eigene Wohnung: Strom & Gas Starterpaket' im Plasma-CI. Kurzes Grundwissen (Zählernummer finden, Verbrauch schätzen für 1-Personen-Haushalt, Grundversorgung vermeiden, Abschlag realistisch wählen) plus abhakbare Erstanmelde-Checkliste und ein kleines Glossar (Arbeitspreis, Grundpreis, Abschlag, Grundversorgung). NAP-Fuß, CTA-Box."

## 14. Verbrauchs-/Zählerstand-Tagebuch
- **Datei:** `public/downloads/verbrauchs-tagebuch.html` · **Zielseite:** `/ratgeber/strom-sparen-haushalt` · **Format:** Druckbare Tabelle (optional .xlsx)
- **Prompt:** „Erstelle ein A4-Verbrauchs-Tagebuch im Plasma-CI zum monatlichen Eintragen. Tabelle: Datum, Zählerstand Strom, Zählerstand Gas, Differenz/Verbrauch, Notiz. Zwölf Zeilen (ein Jahr) plus Feld für Anfangsstand. Kurzer Hinweis, wie man drohende Nachzahlung früh erkennt. NAP-Fuß, CTA-Box."

---

**Hinweis:** Dateinamen bitte exakt beibehalten, dann greifen die bestehenden Download-Buttons und die `/vorlagen`-Bibliothek automatisch. Excel-Varianten (10, 11, 14) können als `.xlsx` mit gleichem Dateinamen (Endung `.xlsx`) geliefert werden; dann in den Zielseiten `lead_magnet_file` auf die `.xlsx` umstellen (sagt mir Bescheid, ich passe es an).
