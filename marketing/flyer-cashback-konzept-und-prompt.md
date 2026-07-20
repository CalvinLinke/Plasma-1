# Flyer „50 € Cashback" — Konzept + Claude-Code-Prompt

Ziel: Haushaltsverteilung (DIN A5, beidseitig). Botschaft: Neuer Stromvertrag über Plasma = günstigere Konditionen **plus 50 € Cashback** (Anteil unserer Provision, Auszahlung nach Lieferbeginn). QR führt auf eine eigene Landingpage `/cashback`, WhatsApp als zweiter Weg.

---

## 1. Zielgruppe — Kritik und Empfehlung

**Was für „sozial schwache Haushalte" spricht:**
- Größtes Sparpotenzial: Genau diese Haushalte stecken überdurchschnittlich oft in der teuren **Grundversorgung**, weil ihnen der Wechsel erschwert wird oder sie ihm misstrauen.
- 50 € sofort spürbar: Bei kleinem Budget ist ein fester Geldbetrag ein stärkerer Hebel als „bis zu X % sparen".
- Wenig umworben: Vergleichsportale und Anbieter meiden diese Gruppe eher — wenig Werbewettbewerb im Briefkasten.

**Was dagegen spricht (ernst nehmen):**
1. **Bonitätsfalle:** Die meisten Versorger machen eine Schufa-Prüfung. Ein Teil der Interessenten wird abgelehnt → Frust beim Kunden („wieder ein leeres Versprechen"), Aufwand ohne Provision bei euch. **Gegenmaßnahme:** Vorab klären, welche eurer Anbieter kulant prüfen bzw. Kaution/Vorkasse anbieten; auf dem Flyer nichts versprechen, was an der Bonität scheitern kann („Wir prüfen, was für Sie möglich ist" statt „Jeder bekommt…").
2. **Storno-Risiko:** Widerruf/Frühkündigung = Provisions-Rückforderung. Die gewählte Auszahlung **nach Lieferbeginn** fängt das größtenteils ab — Bedingung sauber kommunizieren.
3. **Zahlungsausfall-Quote:** Anbieter kündigen bei Zahlungsverzug → erhöhte Stornoquote kann euer Standing bei den Anbietern belasten. Beobachten, ggf. Verteilgebiete nachsteuern.
4. **Stigma-Risiko:** „Sozial schwach" darf **nirgends** als Ansprache erscheinen. Targeting läuft über das **Verteilgebiet** (z. B. Gorbitz, Prohlis, Reick, Plattenbau-Quartiere), die Ansprache selbst ist neutral: „Haushalte, die noch nie gewechselt haben".

**Empfehlung:** Zielgruppe beibehalten, aber als **„Wenig-Wechsler-Gebiete"** definieren (Grundversorgungs-Quote statt Einkommen). Das schließt auch ältere Haushalte ein — zweite starke Gruppe mit identischem Problem. Sprache: einfach (B1-Niveau), große Schrift, keine Fachbegriffe. Optional eine mehrsprachige Zeile (TR/AR/RU/UA): „Wir sprechen einfach und erklären alles."

## 2. Rechtlicher Rahmen (Kurzfassung)

- **Transparenzgebot (§ 5a UWG):** Bedingungen der Prämie müssen klar, eindeutig und leicht zugänglich sein — Kernbedingungen aufs Flyer-Kleingedruckte, vollständige Bedingungen auf `/cashback`.
- Pflichtangaben im Kleingedruckten: einmal pro Haushalt/Zähler · nur bei Neuabschluss über Plasma · Auszahlung per Überweisung innerhalb von 6 Wochen nach erfolgtem Lieferbeginn · keine Barauszahlung · Anbieterannahme vorbehalten.
- Flyer muss klar **als Werbung erkennbar** sein; Gutschein-Optik ja, aber kein täuschend echter Scheck/Behördenbrief (Irreführungsverbot).
- Absender vollständig (NAP), keine unbelegten Superlative.

## 3. Flyer-Mechanik

**Wow-Effekt (Vorderseite):** Der Flyer **ist** der Gutschein. Riesige „50 €" in Gutschein-Optik mit Perforationslinien-Look und Aktionscode. Headline: **„Dieser Zettel ist 50 € wert."** Das durchbricht den Briefkasten-Reflex, weil Wegwerfen sich wie Geldwegwerfen anfühlt.

**Conversion-Pfad (Rückseite), 3 Schritte, Icon-geführt:**
1. Letzte Stromrechnung mit dem Handy abfotografieren.
2. QR scannen und Foto hochladen — **oder** direkt per WhatsApp schicken.
3. Wir suchen den günstigeren Tarif und übernehmen den kompletten Wechsel. Nach Lieferbeginn überweisen wir 50 €.

**Drei Kontaktwege** (Zielgruppe teils wenig digital): QR/Landingpage · WhatsApp-Nummer groß · Telefonnummer („Lieber anrufen? Wir erklären alles.").

**QR-Best-Practices:** mind. 2 cm Kantenlänge (A5), viel Ruhezone, SVG/hochauflösend in den Druck, **dynamischer QR** (Ziel nachträglich änderbar, Scans messbar), CTA direkt am Code („Scannen und 50 € sichern"). QR-Codes steigern Print-Response um bis zu 30 %; klare Handlungsaufforderung am Code vervielfacht die Scanrate.

**Messbarkeit:** Pro Verteilgebiet eigener QR-Parameter/Aktionscode (`/cashback?f=gorbitz`), Landingpage fragt „Wo haben Sie den Flyer erhalten?" nicht ab — der Code reicht. Realistische Response Haushaltswerbung: 0,1–5 %; mit starkem Geld-Anreiz und QR sind 1–3 % erreichbar.

**Noch zu bauen (nicht Teil des Flyer-Prompts):** Landingpage `/cashback` — maximal reduziert: 50-€-Versprechen wiederholen, Foto-Upload, WhatsApp-Button, Telefonnummer, vollständige Cashback-Bedingungen.

---

## 4. Finaler Prompt für Claude Code

> **Datei:** `marketing/flyer/cashback-flyer-a5.html` · **Format:** DIN A5, 2 Seiten (Vorder-/Rückseite), druckoptimiert

**Prompt:**

„Erstelle einen druckfertigen Flyer als eigenständige HTML-Datei `marketing/flyer/cashback-flyer-a5.html` für Plasma Energie Solution. Zwei Seiten DIN A5 Hochformat (148 × 210 mm) mit sauberem `@page`-Setup (3 mm Beschnittzugabe, `print-color-adjust: exact`), Seite 1 = Vorderseite, Seite 2 = Rückseite, jeweils als eigene `page`-Sektion mit Seitenumbruch.

**Plasma-CI:** Marine `#1A1B4B`, Indigo `#4B0082`, Violett `#7B61FF`, Cyan `#00F0FF`, Verlauf `linear-gradient(135deg,#4B0082,#1A1B4B)`. Logo = abgerundetes Quadrat mit Violett-Cyan-Verlauf und weißem „P". Schrift Inter/System-Sans. Sie-Form, einfache Sprache (B1), große Schrift (Fließtext min. 11 pt), keine Gedankenstriche im Text (Komma/Punkt/Doppelpunkt), keine Fachbegriffe.

**Vorderseite (Wow-Effekt, Gutschein-Prinzip):** Dunkler Marine-Indigo-Verlauf als Fläche. Im Zentrum eine helle Gutschein-Karte mit gestrichelter Rahmenlinie (Perforations-Optik) und leichtem Schatten, darin: übergroßes „50 €" (Cyan-Violett-Verlauf als Textfarbe, größtes Element der Seite), darüber klein „IHR CASHBACK-GUTSCHEIN", darunter der Aktionscode „DD50" in einer Code-Pille. Headline über der Karte: „Dieser Zettel ist 50 € wert." Subline: „Wechseln Sie Ihren Stromanbieter mit uns. Sie zahlen weniger im Monat und bekommen 50 € von uns überwiesen. Kostenlos, ohne Vorkosten." Unten rechts QR-Code-Platzhalter (weiß hinterlegt, mindestens 22 × 22 mm, Ruhezone, `id="qr-front"` als austauschbares `<img src="assets/qr-cashback.svg">`) mit CTA direkt daneben: „Scannen und 50 € sichern". Kleines Plasma-Logo + Wortmarke oben. Dezenter Hinweis „Werbung · Aktion der Plasma Energie Solution" am Rand.

**Rückseite (heller Grund, Anleitung + Vertrauen):** Titel „So einfach kommen Sie an Ihre 50 €". Drei nummerierte Schritt-Karten mit Icons: 1. „Letzte Stromrechnung mit dem Handy abfotografieren." 2. „QR-Code scannen und Foto hochladen. Oder schicken Sie das Foto per WhatsApp an +49 172 8182583." 3. „Wir finden einen günstigeren Tarif und erledigen den kompletten Wechsel für Sie. Nach dem Start Ihres neuen Vertrags überweisen wir Ihnen 50 €." Danach eine Zeile mit drei Kontaktwegen als gleichwertige Buttons/Karten: QR + plasma-energie.de/cashback · WhatsApp · Telefon „Lieber anrufen? Wir erklären Ihnen alles in Ruhe." Vertrauensblock mit vier Häkchen (Cyan): „Kostenlos und unverbindlich" · „Persönlicher Ansprechpartner aus Dresden, kein Callcenter" · „Wir übernehmen Kündigung und Anmeldung komplett" · „748 Anschlüsse mit nachgewiesener Ersparnis". Zweiter QR-Code-Platzhalter (`id="qr-back"`, gleiche Mindestgröße).

**Kleingedrucktes (Fußbereich Rückseite, gut lesbar, min. 7 pt):** „50 € Cashback einmal pro Haushalt und Stromzähler bei Neuabschluss eines Stromvertrags über Plasma Energie Solution. Auszahlung per Überweisung innerhalb von 6 Wochen nach erfolgtem Lieferbeginn. Keine Barauszahlung. Annahme durch den Energieversorger vorbehalten. Alle Bedingungen: plasma-energie.de/cashback". Darunter NAP-Fußzeile: „Plasma Energie Solution · Grüne Straße 13b, 01067 Dresden · +49 172 8182583 · box@plasma-energie.de · plasma-energie.de".

**Nicht tun:** keine Tabellen, keine Preisvergleiche, kein „Wir sind die Besten", keine Bewertung oder Ersparnis-Zahl versprechen, die von der Bonität abhängen könnte, nichts, was die Zielgruppe als bedürftig anspricht. Der Flyer muss auch ohne Farbe (Graustufen-Test) lesbar bleiben. Prüfe am Ende per Print-Preview-Logik, dass beide Seiten exakt auf je eine A5-Seite passen und nichts abgeschnitten wird."

---

## 5. Offene Punkte vor dem Druck

- [ ] Landingpage `/cashback` bauen (Upload + WhatsApp + Bedingungen) — eigener Prompt.
- [ ] Dynamischen QR-Code erzeugen (pro Verteilgebiet eigene URL/Parameter) und als `assets/qr-cashback.svg` einsetzen.
- [ ] Cashback-Bedingungen final juristisch gegenlesen lassen (UWG-Transparenz).
- [ ] Anbieter-Portfolio auf Bonitäts-Kulanz prüfen (Ablehnungsquote klein halten).
- [ ] Verteilgebiete nach Grundversorgungs-Quote wählen, Rücklauf je Gebiet messen.
