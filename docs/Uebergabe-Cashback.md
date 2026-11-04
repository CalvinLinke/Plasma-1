# Übergabe: Cashback-Strecke /cashback (Code DRESDEN50)

Stand: 04.11.2026, 18:30 Uhr (Foto-Weg entfernt, Flyer v4-Prompt). Vollständige Übergabe aus der Sitzung mit Calvin. Diese Datei als Prompt in eine neue Claude-Code-Sitzung im Projekt „WEBSITE Plasma“ geben oder mit „Lies docs/Uebergabe-Cashback.md und arbeite dort weiter“ starten.

---

## 0. Anweisung an die neue Sitzung

- Du arbeitest im Repo `CalvinLinke/Plasma-1` (lokal: Ordner „WEBSITE Plasma“), Branch `feature/cashback-live`.
- Lies zuerst: `CLAUDE.md`, diese Datei, `docs/Cashback-Live.md`, `docs/Partner-Tarifpruefung.md`, `docs/Antragsformular-Pflichtfelder.md`.
- Arbeitsregeln von Calvin:
  - Antworten auf Deutsch, kurz und stichpunktartig, direkt und ehrlich, ohne Schönfärberei.
  - In allen Texten, die du für ihn schreibst (UI, Mails, Doku): keine Gedankenstriche. Komma, Punkt oder Doppelpunkt verwenden.
  - Sichtbare Änderungen an Website oder Landingpages: vorher Screenshots zeigen, live erst nach seiner Freigabe. Immer Marken-CI (Schriften, Farben, Look).
  - Nie selbst auf `main` veröffentlichen. Deploy läuft als Auftrag an Robert (pull, merge, deploy).
  - Sie-Form auf der Website, einfache Sprache (B1), Verbotswörter aus `CLAUDE.md` beachten.
- Nächste Aufgabe: Abschnitt 10 (Rechnungs-Helfer) umsetzen, danach Abschnitt 9 abarbeiten bzw. an Robert geben.

---

## 1. Ausgangslage

- Plasma Energie Solution vermittelt Strom- und Gasverträge. Kollege Robert (Robert Kramer) hat im Projekt einen passwortgeschützten Prototyp gebaut: Kunde kommt über einen Flyer, gibt seine Daten ein, bekommt sofort ein Angebot und schließt ab.
- Calvin hat vier Druckvorlagen (je 2 Seiten), alle QR-Codes führen auf `https://plasma-energie.de/cashback` (ohne Parameter):
  - Cashback-Flyer A5 quer, Cashback-Postkarte Maxi
  - Weihnachts-Flyer A5 quer, Weihnachts-Postkarte Maxi
  - Inhalt heute: Vorderseite „Strom wechseln. 50 € bekommen / geschenkt.“, Gutschein-Optik „50 €“, Code `DRESDEN50`, QR, `Cashback@plasma-energie.de`, Zeilen auf Ukrainisch und Arabisch. Rückseite „So funktioniert's“: 1. Stromrechnung fotografieren, 2. Per Mail an uns senden, 3. Sie bekommen 50 €. Kleingedrucktes: 50 € einmal pro Haushalt und Zähler bei Neuabschluss über Plasma, Auszahlung per Überweisung innerhalb von 6 Wochen nach Lieferbeginn, keine Barauszahlung, Annahme durch Versorger vorbehalten, Bedingungen auf plasma-energie.de/cashback.
- Widersprüche vor der Arbeit: Flyer sagt „per Mail senden“, Landingpage sagte „hochladen“. Flyer-Code `DRESDEN50`, Landingpage zeigte `DD50`. QR ohne Kennung, Rücklauf nicht messbar.
- Calvins Wunsch: Landingpage und gesamte Funktion live-fähig, Kennung DRESDEN50, alle angelegten Kontakte nachvollziehbar abgelegt, damit nach erfolgreichem Abschluss die 50 € ausgezahlt werden können. Danach überarbeitet Calvin Flyer und Postkarte passend zur Strecke. Es muss einfach, verkäuflich und für jeden zugänglich bleiben.

---

## 2. Git-Stand

- Beim ersten `git pull` hing der Ordner wegen fehlender Löschrechte halb fest. 41 bereits gezogene, mit GitHub identische Dateien wurden nach `.git/pull-backup-20261104` verschoben, danach `git merge --ff-only origin/main` auf `69df94a` (Roberts letzter Commit: Portal-Login für Provision und MaLo-ID). Der Backup-Ordner enthält nur Duplikate und kann gelöscht werden.
- Branch `feature/cashback-live` ab `69df94a`:
  - `b1decdc` feat(cashback): Live-Strecke /cashback mit Sofort-Angebot, NE-Auftrag und Notion-Ablage
  - `4fe9f63` feat(cashback): Wechseldaten für Anmeldung und Kündigung vollständig erfassen
  - plus Commit mit dieser Übergabedatei
- Nicht gepusht, nicht live. `main` unverändert.
- `signatur-plasma.html` im Projekt-Root ist untracked und stammt nicht aus dieser Sitzung. Nicht anfassen.

---

## 3. Analyse von Roberts Prototyp (unverändert im Repo)

- Route `/prototyp/wechsel?code=…&lang=de|uk|ar|en`, Zugang über `/prototyp/zugang` mit Passwort. Das Passwort steht im Klartext in `lib/prototyp-gate.ts` (bei öffentlichem Repo wirkungslos). `/prototyp/` ist in `robots.ts` gesperrt.
- Schritte: PLZ + Haushaltsgröße (1 bis 5 Personen = 1.300 / 2.000 / 2.600 / 3.000 / 3.500 kWh) oder kWh → ein Tarif (günstigster mit Provision ≥ 80 €, Schwelle im Prototyp sichtbar und änderbar) → Person → Zähler und Konto → „Zahlungspflichtig bestellen“ → nichts wird gesendet, Auftrag bleibt im Browser (`testMode: "1"`).
- Preise in `lib/prototyp-wechsel.ts` sind erfunden. Nur „Ideal“ (Süwag Naturstrom Ideal, 34,42 ct, 92,64 €/Jahr, Provision 68 € mit 50 € Bonus) stammt aus dem echten Referenzlauf (1.000 kWh, 01067).
- Gut: mobil gedacht, vier Sprachen inkl. RTL, wenig Ablenkung.
- Lücken, die mit der neuen Strecke geschlossen bzw. benannt wurden: keine Live-Preise, kein Auftrag an NE, 50 € tauchten im Ablauf nicht auf, keine Ersparnisanzeige, MaLo-ID fehlte, Foto-Button setzte nur Beispielwerte, keine Pflichtinfos vor dem Button, Pitch „günstigster“ irreführend (nur innerhalb der Provisionsauswahl).

---

## 4. Neue Energie: wie der Ablauf wirklich ist

- Das Angebot erstellt nicht Neue Energie, sondern unsere Strecke selbst aus dem Tarifrechner im NE-Partner-Portal (dort stehen Preis, Bonus und Provision; die `external_api` kennt keine Provision).
- Auftrag: Die Daten gehen per API an Neue Energie (`POST https://service.neue-energie.de/external_api/contracts`, Bearer-Token). NE leitet an den Versorger weiter.
- API-Eigenheiten (aus `docs/Partner-Tarifpruefung.md`): kein Batch, ein POST pro Tarif-ID. Preise werden ermittelt, indem man Dummy-Preise schickt; die API antwortet mit „Correct values (basePrice / workingPrice): [92.64, 34.42]“ oder feldweise „Invalid basePrice, correct value: …“. Privat = brutto, Grundpreis in €/Jahr. `type_changing_provider` für Wechsel. Vorversorger mit vollem Namen (nur „Vattenfall“ führt zu „Tarif unter dieser PLZ nicht verfügbar“). Ohne MaLo lehnen mehrere Versorger ab. Endpoints `/providers`, `/scans`, `/statuses` sind noch nicht eingebaut.
- Digitale Signatur: gibt es nicht und ist nicht nötig. § 41b Abs. 1 EnWG: Energielieferverträge mit Haushaltskunden außerhalb der Grundversorgung bedürfen der Textform. Bestellung per Button, der Versorger schickt die Vertragsbestätigung per E-Mail. Auf Flyern daher „online abschließen“, nicht „unterschreiben“.
- Kündigung: Der neue Versorger kündigt beim Altversorger und meldet beim Netzbetreiber an. Seit dem 24-Stunden-Lieferantenwechsel (LFW24, ab 6.6.2025) ist die MaLo-ID (11 Ziffern) der zentrale Schlüssel; nur Zählernummer reicht nicht mehr für den sofortigen Start, ohne MaLo geht es über Zählernummer + Adresse und dauert länger bzw. führt zu Klärfällen. Kündigungsfristen des alten Vertrags gelten weiter (Grundversorgung: zwei Wochen). Name und Daten müssen exakt wie beim alten Vertrag sein, sonst kann der Altversorger die Kündigung nicht zuordnen.

---

## 5. Gebaute Lösung (Branch feature/cashback-live)

### Dateien

| Datei | Inhalt |
|---|---|
| `app/(site)/cashback/page.tsx` | Landingpage umgebaut: Hero links Versprechen, rechts die Strecke; FAQ und Schritte neu; Code aus URL. Foto-Upload entfernt (siehe 5a) |
| `components/cashback/CashbackFlow.tsx` | Client-Komponente der Strecke (4 Schritte + Fertig), Sprachumschalter, RTL |
| `lib/cashback/config.ts` | Code, Aliase, Schwelle, Modus, Demo, Quelle |
| `lib/cashback/angebot.ts` | Portal-Abruf, Tarif-Parser, Auswahl, Cache, Kundensicht |
| `lib/cashback/siegel.ts` | AES-GCM-Token (2 Std.), Drosselung, Client-IP |
| `lib/cashback/pruefung.ts` | Typen, Validierung (Browser + Server), IBAN-Prüfziffer, Bereinigung |
| `lib/cashback/auftrag-ne.ts` | Preisprüfung + `POST /contracts`, Termin-Logik, Telefon-Split |
| `lib/cashback/notion.ts` | Notion-Datenbank „Cashback-Wechsel“, Anlegen, Duplikatprüfung |
| `lib/cashback/mails.ts` | Kundenbestätigung, interne Meldung |
| `lib/cashback/texte.ts` | Neue Texte in de, uk, ar, en (Rest aus `lib/prototyp-texte.ts`) |
| `app/api/cashback/angebot/route.ts` | `POST {plz, ort, kwh}` → `{status, demo, tarif, token}` |
| `app/api/cashback/auftrag/route.ts` | `POST {token, person, zustimmungen, code, quelle, sprache, abschlagHeute, website}` |
| `components/Navigation.tsx` | Fix Handymenü (siehe unten) |
| `docs/Cashback-Live.md` | Technik-Doku und Go-live-Checkliste |
| `.env.local.example`, `CLAUDE.md` | Neue Variablen, Verweis auf Doku |

### Ablauf für den Kunden

1. QR öffnet `plasma-energie.de/cashback?f=<variante>`; optional `&code=…`. Standard ist `DRESDEN50`, `DD50` wird auf `DRESDEN50` umgeleitet, unbekannte Codes fallen auf den Standard zurück (`CASHBACK_CODES`).
2. Schritt „Angaben“: PLZ, Ort (bei PLZ 01067 bis 01328 automatisch „Dresden“), Personen im Haushalt oder kWh, freiwillig „Ihr Abschlag heute in € pro Monat“.
3. Schritt „Angebot“: Anbieter, Tarifname, großer Monatsabschlag (ohne Bonus), „X € im ersten Jahr, Bonus schon abgezogen“, Ersparnis „Sie sparen ungefähr X € im Jahr“ (nur wenn Abschlag angegeben und Ersparnis ≥ 10 €), Arbeitspreis, Grundpreis, Bonus, Laufzeit, Preisgarantie (wenn vorhanden), Ökostrom-Badge (wenn vorhanden), Balken „Plus 50 € von uns, sobald Ihr neuer Vertrag läuft“, Button „Weiter zum Abschluss“, Hinweis „Rechnung zur Hand nehmen“.
   Kein Tarif: „Hier finden wir gerade keinen passenden Tarif.“ mit Buttons WhatsApp (Text mit Code und PLZ vorbelegt) und Anrufen. Fehler: „Der Preis lässt sich gerade nicht laden.“ gleiche Buttons.
4. Schritt „Person“: Anrede, Vorname, Nachname, Geburtstag (ab 18, max. 110 Jahre), E-Mail, Telefon, Straße, Hausnummer, PLZ (gesperrt, aus Schritt 1), Ort. Hinweis „Bitte genau so, wie es auf Ihrer Stromrechnung steht.“
5. Schritt „Zähler und Konto“: bisheriger Versorger, Kundennummer, Zählernummer, MaLo-ID (+ Haken „finde ich nicht“), Jahresverbrauch laut Rechnung (vorbelegt), „Schon selbst gekündigt?“ Ja/Nein (+ Datum bei Ja), IBAN, Kontoinhaber, Zusammenfassung (Tarif, Preise, Bonus, Verbrauch, Lieferstelle), drei Häkchen (Bestellung inkl. Kündigungsauftrag, Datenschutz mit Link, Aktionsbedingungen mit Link #bedingungen), unsichtbarer Honeypot, Button „Zahlungspflichtig bestellen“, Hinweis 14 Tage Widerruf, bei Fremdsprache „Der Vertrag selbst bleibt auf Deutsch.“
6. Fertig: „Geschafft. Ihr Auftrag ist da.“, Vorgangsnummer `CB-JJMMTT-XXX`, vier nächste Schritte.

### Auswahl- und Preislogik

- Quelle: Portal-Login (`loginNeueEnergiePortal`), `load-models`, `POST /partner-area/calculator/tariffs` mit PLZ, Ort, kWh, Strom, privat, Wechsel. Antwort base64 → `decodePortalTariffs` → `portalTarifLesen` (defensiv: `tariffId/id`, `providerName/companyName/company.name`, `name/tariffName`, `calculator.workingPrice`, `calculator.basePrice`, `calculator.bonus`, `provision` oder `provision.cost`, optional Laufzeit, Preisgarantie, Öko). Ohne ID, Preis oder Provision wird der Tarif verworfen.
- Filter: Provision ≥ `CASHBACK_MIN_PROVISION_EUR` (Standard 80). Sortierung nach Jahreskosten im 1. Jahr = Grundpreis + Arbeitspreis × kWh − Bonus. Abschlag = (Grundpreis + Arbeitspreis × kWh) / 12.
- Cache 30 Minuten pro PLZ|Ort|kWh je Serverless-Instanz.
- Token: komplettes internes Angebot (inkl. Provision, Tarif-ID, kWh, PLZ) AES-GCM-verschlüsselt mit SHA-256(`CASHBACK_SECRET` oder `DOWNLOAD_SECRET`), gültig 2 Stunden. Kunde sieht nur `kundenSicht`.
- Verbrauch laut Rechnung ≠ kWh des Angebots: Browser holt neues Angebot, setzt Bestell-Häkchen zurück, zeigt „Wir haben den Preis mit Ihrem Verbrauch laut Rechnung neu berechnet. Bitte prüfen Sie die Bestellung und bestätigen Sie erneut.“ Server lehnt mit `409 verbrauchGeaendert` ab, falls es trotzdem abweicht.

### Validierung (Browser und Server identisch, `pruefung.ts`)

- PLZ 5 Ziffern, Ort ≥ 2, kWh 500 bis 50.000 (Angebot), Verbrauch laut Rechnung 300 bis 50.000.
- Anrede Frau/Herr, Vor- und Nachname ≥ 2, Geburtstag volljährig, E-Mail-Format, Telefon ≥ 6 Ziffern, Straße ≥ 2, Hausnummer, Ort.
- Zählernummer ≥ 4, MaLo genau 11 Ziffern oder Haken „unbekannt“, Kundennummer ≥ 3, Vorversorger ≥ 3, IBAN `DE` + 20 Ziffern mit mod-97-Prüfziffer, Kontoinhaber ≥ 3, „Schon gekündigt“ Pflicht, bei Ja Wunschtermin ab morgen bis 12 Monate.
- Drei Zustimmungen Pflicht. PLZ der Person wird serverseitig auf die PLZ des Angebots gesetzt.

### Übermittlung an Neue Energie (`auftrag-ne.ts`)

- Modus `CASHBACK_NE_MODUS`: `aus` (nur speichern), `test` (Standard, testMode 1, kein Vertrag), `live` (testMode 0). Demo-Tarife werden nie gesendet.
- 1) Preisprüfung mit echter Adresse über `checkTariffPrices` (aus `lib/neue-energie.ts`). 2) Abweichung > 0,05 ct/kWh oder > 1 €/Jahr zum angezeigten Angebot: nicht senden, Status „preis-abweichung“. 3) `POST /contracts` als FormData:
  `testMode, tariffId, type=type_changing_provider, appointment (appointment_next_possible | appointment_exact_date), appointmentDate (dd.mm.yyyy; nächstmöglich = heute + NEUE_ENERGIE_APPOINTMENT_DAYS, Standard 14; sonst Wunschtermin), priceDate, ref=<Vorgangsnummer>, externalId=NEUE_ENERGIE_EXTERNAL_ID (Standard 13120), consumption, zip, city, street, houseNumber, salutation (Herr = salutation_mr, Frau = NEUE_ENERGIE_SALUTATION_FRAU oder salutation_mrs), firstname, lastname, birthday (dd.mm.yyyy), secondOwner=false, billing=false, accountDelivery=account_delivery_email, email, phoneCode (erste 4 Ziffern, +49 → 0), phone (Rest), meterNumber, currentProviderName, clientNumber, individualPayment=false, accountHolder, iban, privacyAccepted=true, basePrice, workingPrice, marketLocation + marketLocationId (wenn vorhanden)`.
- Ergebnis: `uebermittelt`, `test-ok`, `uebersprungen`, `preis-abweichung`, `fehler`; Auftrags-ID aus `result.id/contractId/orderId/number`.

### Ablage Notion „Cashback-Wechsel“ (`notion.ts`)

- Nutzt `NOTION_API_KEY` und `NOTION_PARENT_PAGE_ID` (wie Partner-Anfragen). Datenbank-ID aus `CASHBACK_NOTION_DATABASE_ID`, sonst Notion-Suche nach dem Titel, sonst Neuanlage. Fehlende Spalten werden ergänzt, bestehende Spalten und Auswahloptionen nicht überschrieben.
- Spalten: Name, Vorgang, Status, Code, Quelle, Sprache, Eingang, Cashback €, Lieferbeginn, Cashback ausgezahlt am, Duplikat-Verdacht, E-Mail, Telefon, Anrede, Geburtsdatum, Straße, Hausnummer, PLZ, Ort, Zählernummer, Marktlokation, Kundennummer alt, MaLo fehlt, Bisheriger Versorger, Selbst gekündigt, Lieferbeginn Wunsch, IBAN, Kontoinhaber, Neuer Versorger, Tarif, Tarif-ID, Verbrauch kWh, Arbeitspreis ct/kWh, Grundpreis €/Jahr, Bonus €, Jahreskosten €, Provision € (intern), Abschlag bisher €, Übermittlung (aus/test/live/demo), NE-Auftrags-ID, NE-Antwort.
- Status: Neu · Test ok, manuell anlegen · An Neue Energie übermittelt · Manuell prüfen · Belieferung gestartet · Cashback ausgezahlt · Abgelehnt / storniert.
- Duplikat-Verdacht: Zählernummer existiert schon (Cashback nur einmal pro Zähler).
- Auszahlung heute manuell: Lieferbeginn und „Belieferung gestartet“ von Hand setzen, überweisen, „Cashback ausgezahlt am“ eintragen.

### Reihenfolge im Auftrags-Endpoint

Drosselung (6 Aufträge / 10 Min. je IP; Angebote 20 / 10 Min.) → Honeypot → Token entschlüsseln (sonst `abgelaufen`) → bereinigen und validieren → Verbrauch prüfen → Notion anlegen (Status Neu) → Neue Energie → Notion-Status aktualisieren → parallel: Kundenmail, interne Mail an `CASHBACK_INTERN_MAIL` (Standard box@plasma-energie.de; IBAN maskiert, nur bei Notion-Ausfall voll), Telegram (`notifyPartnerLeadTelegram`). Scheitern Notion und interne Mail gemeinsam: `500 speicherFehler`. Sonst `{status: "ok", vorgang}`. Der Kunde bekommt die Bestätigung auch, wenn NE scheitert (dann Notion „Manuell prüfen“).

### Mails

- Kunde: Betreff „Ihr Stromwechsel mit Plasma: Auftrag CB-… ist eingegangen“, Tabelle mit Vorgang, Versorger, Tarif, Preisen, Bonus, kWh; nächste Schritte: Weiterleitung, Vertragsbestätigung des Versorgers per E-Mail (mit Bedingungen und Widerruf), Kündigung durch neuen Versorger bzw. Wunschtermin bei Selbstkündigung, 50 € innerhalb von 6 Wochen nach Lieferbeginn. Reply-To box@.
- Intern: alle Daten, Duplikat- und Notion-Warnung, NE-Ergebnis, Provision, Link nach Notion.

### Landingpage /cashback

- Hero: Pill „Aktion · Code DRESDEN50“, H1 „Strom wechseln und 50 € bekommen.“, Text „Postleitzahl eingeben, Preis sofort sehen, online abschließen. Sobald Ihr neuer Vertrag läuft, überweisen wir Ihnen 50 €. Kostenlos und ohne Vorkosten.“, Gutschein und Häkchen nur ab Desktop, Link „Lieber ohne Tippen? Rechnung als Foto schicken“. Rechts die Strecke.
- Schritte: Preis berechnen · Online abschließen (Kundennummer, Zählernummer, MaLo, Verbrauch, IBAN; kein Papier, keine Unterschrift) · 50 € bekommen.
- „Wann bekomme ich die 50 €?“ angepasst. Kein Foto-Upload mehr. FAQ neu: „Muss ich etwas unterschreiben?“, „Welche Angaben brauche ich?“, Kündigung inkl. Grundversorgung zwei Wochen. Bedingungen mit Anker `#bedingungen` und Satz zur Auszahlung auf das angegebene Konto.

### 5a. Foto-Weg entfernt (Entscheidung Calvin, 04.11.2026, 18:29)

- Auf /cashback gibt es nur noch die manuelle Eingabe. Entfernt: Abschnitt `#foto` mit `AngebotForm`, Link „Lieber ohne Tippen? Rechnung als Foto schicken“ im Hero, Foto-Button bei „kein Tarif“ und „Preis lädt nicht“, Foto-Hinweise in FAQ und „Wann bekomme ich die 50 €?“.
- Ersatz: Hero-Zeile „Fragen? Rufen Sie an: 0172 8182583“. Bei „kein Tarif“ und Ladefehler die Buttons „Per WhatsApp schreiben“ (Nachricht mit Code und PLZ vorbelegt) und „Anrufen“. Texte in allen vier Sprachen angepasst (`whatsappButton`, `keinTarifText`, `fehlerText`).
- Folge: Alle Cashback-Kunden laufen durch die Strecke und landen damit vollständig in Notion. Die Lücke „Foto-Kunden nicht in Notion“ ist erledigt.
- Grund für die Entscheidung: nur ein Prozess, sauber nachverfolgbar.

### Fix Handymenü (betrifft heute die Live-Seite)

- `components/Navigation.tsx`: Das geschlossene mobile Menü hatte gleichzeitig `max-h-[calc(100vh-5rem)]` und `max-h-0`; dadurch war der Header nach dem Scrollen 666 px hoch, unsichtbar, und fing Fingertipps im oberen Bildschirm ab. Jetzt geschlossen `max-h-0 overflow-hidden opacity-0 pointer-events-none invisible`. Header danach 83 px. Auf `main` ist der Fehler noch drin, eigener schneller Deploy sinnvoll.

---

## 6. Wechseldaten (Ergebnis der Prüfung)

| Angabe | Wofür | Formular | NE-Feld |
|---|---|---|---|
| Bisheriger Versorger, voller Name | Kündigung an richtigen Altversorger | Pflicht | `currentProviderName` |
| Kundennummer beim Altversorger | Altversorger ordnet Kündigung zu | Pflicht | `clientNumber` |
| Zählernummer | Zuordnung Lieferstelle | Pflicht | `meterNumber` |
| MaLo-ID, 11 Ziffern | Anmeldung beim Netzbetreiber | Pflicht, außer „finde ich nicht“ | `marketLocation`, `marketLocationId` |
| Jahresverbrauch laut Rechnung | Abschlag, Stufentarife | Pflicht, vorbelegt, Neuberechnung bei Abweichung | `consumption` |
| Schon selbst gekündigt? | keine Doppelkündigung, keine Lücke | Pflicht | `appointment` |
| Wunsch-Lieferbeginn (bei Ja) | nahtloser Start | Datum | `appointment_exact_date`, `appointmentDate` |
| Name und Adresse wie auf Rechnung | Zuordnung beim Altversorger | Hinweis | `firstname`, `lastname`, … |

Nicht abgedeckt: zweiter Vertragsinhaber, abweichende Rechnungsadresse (GFU-Formular kann beides). Diese Fälle über Telefon oder WhatsApp.

---

## 7. Was getestet ist (und was nicht)

- Lokal mit `CASHBACK_DEMO=1` komplett durchgeklickt (iPhone 13 und 1360 px, Deutsch und Arabisch): Angebot, Fehlermeldungen, Neuberechnung bei geändertem Verbrauch, Bestellung, Fertig-Seite.
- API: ungültige Eingaben → `400 ungueltig` mit Feldliste; fehlende Kundennummer erkannt; abweichender Verbrauch → `409 verbrauchGeaendert`; gültig → `ok` mit Vorgangsnummer.
- Neue Energie gegen einen nachgebauten Server: Preis aus „Correct values“ gelesen, Test- und Live-Body korrekt (testMode 1/0, salutation_mrs, Geburtsdatum dd.mm.yyyy, Telefon geteilt, MaLo, ref, clientNumber, appointment_exact_date 01.12.2026), Preisabweichung blockiert den Versand.
- Notion gegen nachgebaute API: Suche, Anlegen, Duplikat-Abfrage, Seite anlegen, Update.
- `tsc` ohne Fehler, `next build` erfolgreich (Google Fonts in der Sandbox gestubbt).
- NICHT getestet: echtes Partner-Portal, echte NE-API, echtes Notion, Mailversand, Telegram. Grund: lokal keine Zugangsdaten.

---

## 8. Umgebungsvariablen (Vercel)

| Variable | Pflicht | Bedeutung |
|---|---|---|
| `NEUE_ENERGIE_PORTAL_USER`, `NEUE_ENERGIE_PORTAL_PASSWORD` | ja | Partner-Login (Preis + Provision) |
| `NEUE_ENERGIE_PORTAL_BASE_URI` | nein | Standard `https://www.neue-energie.de` |
| `NEUE_ENERGIE_BASE_URI`, `NEUE_ENERGIE_API_KEY` | ja | external_api |
| `NEUE_ENERGIE_EXTERNAL_ID` | klären | Standard 13120, vermutlich Partnernummer |
| `NEUE_ENERGIE_SALUTATION_FRAU` | prüfen | Standard `salutation_mrs` |
| `NEUE_ENERGIE_APPOINTMENT_DAYS` | nein | Standard 14 |
| `CASHBACK_NE_MODUS` | ja | `aus` · `test` (Standard) · `live` |
| `CASHBACK_SECRET` | ja | langer Zufallswert |
| `CASHBACK_MIN_PROVISION_EUR` | nein | 80 |
| `CASHBACK_BETRAG_EUR` | nein | 50 |
| `CASHBACK_CODES` | nein | `DRESDEN50` |
| `CASHBACK_NOTION_DATABASE_ID` | nein | sonst Suche/Anlage |
| `CASHBACK_INTERN_MAIL` | nein | box@plasma-energie.de |
| `NOTION_*`, `MS_*`, `TELEGRAM_*` | vorhanden | wie Partner-Anfragen |
| `CASHBACK_DEMO=1` | nur lokal | Beispieltarife, in Produktion wirkungslos |

---

## 9. Offene Punkte und Go-live-Checkliste

1. Robert: Branch pushen, Env-Variablen setzen, `CASHBACK_NE_MODUS=test`, Preview-Deployment.
2. Robert: echter Durchlauf mit eigener Adresse. Prüfen: Feldnamen der Portal-Antwort in `portalTarifLesen`; Portal-Tarif-ID = API-`tariffId`; Provision vor oder nach Bonus (Referenz: 104 € ohne, 68 € mit 50 € Bonus); Anrede Frau; `clientNumber`; `appointment_exact_date`; Bedeutung `NEUE_ENERGIE_EXTERNAL_ID`; Notion-Eintrag, beide Mails, Telegram.
3. Recht: Bestelltext und Kündigungsauftrag, Pflichtinfos vor dem Button (Vertragszusammenfassung, AGB und Widerrufsbelehrung des Versorgers; Quelle in Portal oder API klären), Datenschutzerklärung um Neue Energie und Versorger als Empfänger ergänzen, Cashback-Bedingungen (UWG-Transparenz).
4. Ukrainisch und Arabisch von Muttersprachlern gegenlesen.
5. Danach `CASHBACK_NE_MODUS=live`.
6. Navigation-Fix gern vorab einzeln deployen.
7. Später: `POST /statuses` einbauen (Lieferbeginn und „Belieferung gestartet“ automatisch), NE nach offizieller Provisions-Schnittstelle fragen (Portal-Scraping ist fragil und vertraglich zu klären), zweiter Vertragsinhaber und abweichende Rechnungsadresse, Prototyp-Passwort aus dem Code in eine Env-Variable.
8. Aufräumen: `.git/pull-backup-20261104` löschen.

---

## 10. Nächste Aufgabe: Rechnungs-Helfer (Prompt, 1:1 übernehmen)

Rechercheergebnis dazu: Gleiche Angabe heißt je nach Versorger anders (Kundennummer, Vertragskonto, Vertragskontonummer, Vertrags-Nr.). Häufige Verwechslungen: MaLo-ID (11 Ziffern) mit der 33-stelligen Messlokation, die mit DE beginnt; Kundennummer mit Rechnungsnummer; Rechnungsadresse mit Lieferstelle. Verbrauch steht nur auf der Jahresrechnung, im Abschlagsplan höchstens ein geschätzter Jahresverbrauch. Kündigungsfrist und nächstmöglicher Kündigungstermin sind Pflichtangaben nach § 40 EnWG. Zählernummer steht auch auf dem Zähler unter dem Zählwerk.

```
Baue in die Cashback-Strecke (components/cashback/CashbackFlow.tsx) einen Rechnungs-Helfer: eine anonymisierte Musterrechnung, auf der der Kunde sieht, wo auf seiner eigenen Stromrechnung jede Angabe steht, die er eintippen muss. Ziel: Der Kunde hat seine Rechnung neben sich liegen und findet jede Nummer in wenigen Sekunden.

DARSTELLUNG
- Desktop (ab lg): Der Kasten der Strecke wird zweispaltig, sobald Schritt 1 (Abschlag) oder Schritt 4 (Zähler und Konto) aktiv ist. Links das Formular, rechts ein mitlaufendes Panel (sticky) „So finden Sie die Angaben“ mit der Musterrechnung.
- Mobil: Neben jedem betroffenen Feldlabel ein kleiner Button „Wo steht das?“ (Lucide-Icon FileQuestion). Tippen öffnet ein Bottom Sheet mit dem passenden Ausschnitt der Musterrechnung, vergrößert, Markierung sichtbar. Schließen per Tippen außerhalb oder Wischen nach unten.
- Kopplung: Fokussiert der Kunde ein Feld, wird auf der Musterrechnung der passende Bereich hervorgehoben: Rahmen in Violett #7B61FF, leichter Cyan-Schein #00F0FF, nummerierter Marker. Der Rest der Rechnung wird leicht abgedunkelt. Über dem Panel steht eine kurze Erklärung zum aktiven Feld.
- Animationen höchstens 300 ms. Bei prefers-reduced-motion keine Animation.

MUSTERRECHNUNG (eigene Komponente components/cashback/MusterRechnung.tsx, inline SVG oder HTML/CSS, kein Bild)
- Neutrales, typisches Layout einer deutschen Jahresrechnung für Strom: weißes Papier im Hochformat, Graustufen. Kein Logo und kein Layout eines echten Versorgers nachbauen.
- Diagonales Wasserzeichen „MUSTER“. Darunter klein: „Beispiel. Ihre Rechnung sieht anders aus, die Begriffe sind ähnlich.“
- Alle Daten erfunden und erkennbar unecht:
  Versorger „Musterstrom GmbH“, Kunde „Max Mustermann, Beispielweg 1, 01067 Dresden“, Kundennummer „1234 5678 90“, Rechnungsnummer „R-2026-000001“, Zählernummer „1ABC0012345678“, Marktlokation „51234567890“, Messlokation „DE00012345678900000000000000000001“, Verbrauch „2.150 kWh“.
- Zwei Seiten, im Panel umblätterbar mit Tabs „Seite 1“ und „Seite 2“. Wird ein Feld fokussiert, springt das Panel auf die richtige Seite.
  Seite 1, von oben nach unten:
  a) Briefkopf links mit dem Namen des Versorgers.
  b) Anschriftfeld mit Name und Adresse des Kunden.
  c) Infoblock oben rechts: Kundennummer, Rechnungsnummer, Rechnungsdatum.
  d) Betreff „Jahresrechnung Strom“ mit Abrechnungszeitraum.
  e) Kasten „Ihre Lieferstelle“: Lieferadresse, Zählernummer, Marktlokation (MaLo-ID), klein darunter die Messlokation mit DE.
  f) Ergebnis: Nachzahlung oder Guthaben, hervorgehoben.
  g) Fußzeile mit vollem Firmennamen inkl. Rechtsform, Anschrift und Registergericht.
  Seite 2, von oben nach unten:
  h) Verbrauchsdetails als Tabelle: Zählernummer, Zeitraum, Zählerstand alt und neu, Verbrauch in kWh, Summe fett.
  i) Kasten „Ihr neuer Abschlag“: „monatlich 64,00 € ab 01.12.2026“.
  j) Kasten „Ihr Vertrag“: Tarif, Vertragslaufzeit, „Nächstmöglicher Kündigungstermin“, Kündigungsfrist.

ZUORDNUNG FELD → BEREICH → ERKLÄRUNG (deutsch, einfache Sprache, Sie-Form, keine Gedankenstriche)
1. Abschlag heute (Schritt 1) → i) „Steht im Kasten zum Abschlag oder im Abschlagsplan. Gemeint ist der Betrag, den Sie jeden Monat zahlen.“
2. Bisheriger Versorger → a) und g) „Der Firmenname oben auf der Rechnung. Den vollen Namen mit GmbH oder AG finden Sie ganz unten in der Fußzeile.“
3. Kundennummer → c) „Steht oben rechts. Je nach Versorger heißt sie Kundennummer, Vertragskonto, Vertragskontonummer oder Vertrags-Nr. Nicht die Rechnungsnummer nehmen.“
4. Zählernummer → e) und h) „Steht bei Ihrer Lieferstelle oder in den Verbrauchsdetails, oft als Zähler-Nr. Sie steht auch auf dem Stromzähler selbst, unter dem Zählwerk.“
5. Marktlokations-ID → e) „11 Ziffern, keine Buchstaben. Heißt auch MaLo-ID, Marktlokation oder Marktlokationsnummer. Achtung: Die lange Nummer, die mit DE beginnt, ist die Messlokation. Die brauchen wir nicht.“
6. Jahresverbrauch → h) „Die Summe in kWh in den Verbrauchsdetails Ihrer Jahresrechnung. Auf dem Abschlagsplan steht manchmal ein geschätzter Jahresverbrauch, der geht auch.“
7. Schon gekündigt / Lieferbeginn → j) „Im Kasten zu Ihrem Vertrag stehen Kündigungsfrist und nächstmöglicher Kündigungstermin. Haben Sie selbst gekündigt, wählen Sie den Tag nach dem Vertragsende.“
8. Name, Straße, Ort (Schritt 3) → b) und e) „Bitte genau so schreiben wie auf der Rechnung. Liefer- und Rechnungsadresse können verschieden sein. Für den Wechsel zählt die Lieferstelle.“

TEXTE UND SPRACHEN
- Alle Erklärungen in lib/cashback/texte.ts unter einem neuen Schlüssel rechnungshilfe, für de, uk, ar und en. Ukrainisch und Arabisch mit dem Hinweis „vor Livegang gegenlesen“ kommentieren.
- Die Musterrechnung selbst bleibt auf Deutsch, weil auch die echte Rechnung des Kunden deutsch ist. In uk, ar und en zeigen die Erklärungen den deutschen Begriff in Anführungszeichen, nach dem der Kunde suchen soll (z. B. „Vertragskonto“).
- Arabisch: Das Panel spiegelt sich (RTL). Die Musterrechnung bleibt LTR.
- Label in Schritt 4 umbenennen: „Kundennummer oder Vertragskonto beim bisherigen Versorger“ (in allen Sprachen).

TECHNIK UND QUALITÄT
- Marken-CI: Marine #1A1B4B, Violett #7B61FF, Cyan #00F0FF, Karten mit Radius 24px, Schrift wie auf der Seite. Kein generischer KI-Look.
- Barrierefreiheit: Die Musterrechnung hat aria-label. Die Hervorhebung wird zusätzlich als Text angesagt (aria-live="polite"). Der Button „Wo steht das?“ ist per Tastatur erreichbar.
- Keine echten Firmenlogos, keine echten Kundendaten, keine Inhalte aus dem Ordner rechnungen/.
- Prüfen: npx tsc --noEmit, dann lokal mit CASHBACK_DEMO=1 durchklicken. Screenshots per Playwright in iPhone-13-Größe und bei 1360 px Breite: Schritt 4 mit fokussierter MaLo-ID, das offene Bottom Sheet mobil und Arabisch auf dem Desktop. Ich gebe frei, bevor etwas live geht. Commit auf feature/cashback-live, nicht auf main.
```

---

## 11. Flyer und Postkarte (Calvin macht das als nächsten Schritt)

- Im QR bleibt immer `plasma-energie.de/cashback`, nie `/prototyp` drucken. Je Variante eine Kennung: `?f=cashback-flyer`, `?f=cashback-karte`, `?f=weihnacht-flyer`, `?f=weihnacht-karte` (landet in Notion-Spalte „Quelle“).
- Code einheitlich `DRESDEN50`.
- Erst drucken, wenn die Strecke live ist. Einen Foto- oder Mail-Weg als Ausweich gibt es nicht mehr.
- Nur ein Weg: online über den QR. Für Fragen Telefon und WhatsApp 0172 8182583. Keine Mail-Adresse Cashback@ mehr auf den Drucksachen.
- Satz „Legen Sie Ihre Stromrechnung bereit.“ auf den Flyer.
- Auf dem Flyer „online abschließen“, nicht „unterschreiben“.

Stand Druckvorlagen: Calvin hat Version v3 umgesetzt (zwei Wege, Foto per Mail). Nach der Entscheidung von 18:29 muss v4 ohne Foto- und Mail-Weg entstehen. Prompt dafür:

```
Erstelle aus den vier Plasma-Druckvorlagen in Version v3 (Cashback-Flyer A5 quer, Cashback-Postkarte Maxi, Weihnachts-Flyer A5 quer, Weihnachts-Postkarte Maxi) eine Version v4. v3 bleibt unverändert erhalten.

Grund: Den Foto- und Mail-Weg gibt es nicht mehr. Kunden schließen nur noch online über den QR-Code ab. Für Fragen gibt es Telefon und WhatsApp.

Unverändert lassen: Layout, CI (Marine #1A1B4B, Indigo #4B0082, Violett #7B61FF, Cyan #00F0FF), Schriften, Gutschein-Optik, Code DRESDEN50, alle QR-Codes mit ihren Adressen (?f=cashback-flyer, ?f=cashback-karte, ?f=weihnacht-flyer, ?f=weihnacht-karte), QR mindestens 22 mm mit weißem Rand, Frankierzone und Adressfeld der Postkarten, Leiste „Kostenlos. Kein Risiko.“, NAP-Fußzeile. Keine Gedankenstriche, Sie-Form, einfache Sprache (B1).

ÄNDERUNGEN

1. Mail-Adresse Cashback@plasma-energie.de überall entfernen, auf Vorder- und Rückseiten. In der NAP-Fußzeile bleibt box@plasma-energie.de als Firmenangabe stehen.

2. Flyer-Rückseite, Kontaktbereich: Statt zwei gleichwertiger Wege jetzt EIN Hauptweg und darunter eine kleine Hilfezeile.
   Hauptweg, groß, mit QR: „Online in wenigen Minuten“ / „plasma-energie.de/cashback“.
   Hilfezeile, klein, mit Telefon- und WhatsApp-Icon: „Fragen? Wir helfen persönlich: 0172 8182583, auch per WhatsApp.“
   Den Block „Lieber ohne Tippen?“ komplett streichen.

3. Tipp unter den drei Schritten erweitern (Dokument-Icon):
   „Legen Sie Ihre letzte Stromrechnung bereit. Sie brauchen daraus Kundennummer, Zählernummer und Marktlokations-ID.“
   Ukrainisch und Arabisch nur für den ersten Satz, im selben Stil wie die Schritt-Titel:
   UK: „Підготуйте останній рахунок за електроенергію.“
   AR: „جهّزوا آخر فاتورة كهرباء.“

4. Schritte bleiben, nur Schritt 3 präzisieren:
   1. „QR-Code scannen“ / „Postleitzahl und Personen im Haushalt eingeben.“
   2. „Preis sofort sehen“ / „Ihr neuer Tarif erscheint direkt auf dem Handy.“
   3. „Online abschließen“ / „Daten von der Rechnung eintragen, fertig. Der neue Versorger kündigt Ihren alten Vertrag. Nach Lieferbeginn überweisen wir Ihnen 50 €.“
      Weihnachten: letzter Satz „Ihr Geschenk: 50 € nach Lieferbeginn.“
   Ukrainische und arabische Schritt-Titel wie in v3.

5. Postkarten-Rückseite: Kurzform der beiden Wege streichen. Stattdessen unter den Schritten:
   „Online: QR auf der Vorderseite scannen.“
   „Fragen? 0172 8182583, auch per WhatsApp.“
   Den Tipp „Stromrechnung bereitlegen“ als eine Zeile beibehalten.

6. Vorderseiten: Text neben dem QR bleibt „Jetzt scannen. Preis sofort sehen.“ Sonst nichts ändern.

7. Kleingedrucktes wie in v3 („Angebot abhängig von Postleitzahl und Verbrauch. Annahme durch den Versorger vorbehalten.“ bleibt drin).

PRÜFUNG
- Auf keiner der acht Seiten darf Cashback@ oder das Wort „Foto“ als Weg vorkommen.
- Nichts läuft über, nichts bricht unschön um (Telefonnummer und URL dürfen nicht umbrechen).
- Alle sechs QR-Codes zeigen auf ihre eigene Adresse und sind mindestens 22 mm groß, auch auf den Postkarten.
- Druck-PDFs: 3 mm Beschnitt, CMYK, QR als Vektor.
- Ukrainische und arabische Zeilen vor dem Druck von Muttersprachlern gegenlesen lassen.
- Gedruckt wird erst, wenn die Strecke /cashback live ist.
```

---

## 12. Quellen

- § 41b EnWG (Textform): https://www.gesetze-im-internet.de/enwg_2005/__41b.html
- § 40 EnWG (Rechnungsinhalte): https://www.gesetze-im-internet.de/enwg_2005/__40.html
- EnBW, 24h-Lieferantenwechsel: https://www.enbw.com/service/faq/24h-lieferantenwechsel
- innobu, LFW24: https://www.innobu.com/de/artikel/lieferantenwechsel-24h-lfw24-2026.html
- Stadtwerke Bochum, Datenergänzung Lieferantenwechsel: https://www.stadtwerke-bochum.de/faq/datenergaenzung-lieferantenwechsel-165
- EnBW, Rechnungserläuterung Strom: https://www.enbw.com/service/rechnungserlaeuterung/strom
- stromauskunft.de, MaLo-ID finden: https://www.stromauskunft.de/stromanbieter-wechsel/stromanbieter-wechsel-faq/wo-finde-ich-die-malo-id/
- Entega, Marktlokations-ID: https://www.entega.de/ratgeber/strom/stromanbieter/marktlokations-id/
- energiemarie.de, SachsenEnergie Nummern: https://energiemarie.de/stromanbieter/sachsenenergie/zaehlerstand
