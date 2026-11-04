# Cashback-Strecke /cashback (Code DRESDEN50)

Stand: 04.11.2026. Baut auf Roberts Prototyp `/prototyp/wechsel` auf und macht daraus die echte Strecke auf `/cashback`.

## Ablauf für den Kunden

1. Flyer-QR öffnet `plasma-energie.de/cashback?f=<variante>` (optional `&code=DRESDEN50`, Standard ist DRESDEN50, `DD50` wird umgeleitet).
2. PLZ, Ort, Personen im Haushalt (oder kWh), freiwillig der heutige Abschlag.
3. Angebot sofort: ein Tarif, Monatsabschlag, Jahreskosten, Ersparnis (wenn Abschlag angegeben), plus 50 €.
4. Persönliche Daten.
5. Wechseldaten von der Rechnung (siehe unten), IBAN, drei Häkchen, „Zahlungspflichtig bestellen“.
6. Bestätigungsseite mit Vorgangsnummer `CB-JJMMTT-XXX`, Bestätigungsmail an den Kunden.

Wer nicht tippen will: Foto-Upload weiter unten auf derselben Seite (bestehendes `AngebotForm`, Antwort in 48 Std.).

## Wechseldaten: was der neue Versorger braucht

Der neue Versorger meldet die Lieferstelle beim Netzbetreiber an und kündigt beim Altversorger. Seit dem 24-Stunden-Lieferantenwechsel (6.6.2025) ist die MaLo-ID der zentrale Schlüssel; ohne sie geht es nur über Zählernummer und Adresse und dauert länger oder wird abgelehnt.

| Angabe | Wofür | Im Formular | NE-Feld |
|---|---|---|---|
| Bisheriger Versorger (voller Name) | Kündigung an den richtigen Altversorger | Pflicht | `currentProviderName` |
| Kundennummer beim Altversorger | Altversorger ordnet die Kündigung zu | Pflicht | `clientNumber` |
| Zählernummer | Zuordnung der Lieferstelle | Pflicht | `meterNumber` |
| MaLo-ID (11 Ziffern) | Anmeldung beim Netzbetreiber | Pflicht, außer Haken „finde ich nicht“ (dann Notion „MaLo fehlt“) | `marketLocation`, `marketLocationId` |
| Jahresverbrauch laut Rechnung | Abschlag, Stufentarife | Pflicht, vorbelegt; bei Abweichung wird der Preis neu berechnet und neu bestätigt | `consumption` |
| Schon selbst gekündigt? | sonst doppelte Kündigung oder Lücke | Pflicht Ja/Nein | `appointment` |
| Lieferbeginn-Wunsch (nur bei Ja) | Start nahtlos nach Vertragsende | Datum ab morgen | `appointment_exact_date` + `appointmentDate` |
| Name und Adresse wie auf der Rechnung | Altversorger muss den Vertrag finden | Hinweis im Formular | `firstname`, `lastname`, … |

Bei „Nein“ gilt `appointment_next_possible`: Der neue Versorger kündigt, die Kündigungsfrist des alten Vertrags läuft weiter (Grundversorgung zwei Wochen).

Nicht abgedeckt: zweiter Vertragsinhaber und abweichende Rechnungsadresse (GFU-Formular kann beides). Solche Fälle laufen über den Foto-Weg oder Telefon.

## Technik

| Teil | Datei |
|---|---|
| Oberfläche (4 Sprachen) | `components/cashback/CashbackFlow.tsx`, Texte `lib/cashback/texte.ts` |
| Angebot | `POST /api/cashback/angebot` → `lib/cashback/angebot.ts` (Partner-Portal, Tarifrechner) |
| Auftrag | `POST /api/cashback/auftrag` → Notion, Neue Energie, Mails, Telegram |
| Übermittlung an NE | `lib/cashback/auftrag-ne.ts` (Preisprüfung mit echter Adresse, dann `POST /contracts`) |
| Ablage | `lib/cashback/notion.ts`, Datenbank **Cashback-Wechsel** |
| Angebots-Token | `lib/cashback/siegel.ts` (AES-GCM, 2 Std. gültig, Provision bleibt für den Kunden unsichtbar) |

Auswahl: günstigster Tarif (Jahreskosten im 1. Jahr inkl. Versorger-Bonus), dessen Provision mindestens `CASHBACK_MIN_PROVISION_EUR` beträgt.

Sicherheitsnetz: Erst Notion, dann Neue Energie. Scheitert NE (Preis weicht ab, Tarif nicht lieferbar, Fehler), bekommt der Kunde trotzdem seine Bestätigung, der Vorgang steht in Notion auf **Manuell prüfen**. Fällt Notion aus, enthält die interne Mail an box@ alle Daten inkl. voller IBAN.

## Umgebungsvariablen (Vercel)

| Variable | Pflicht | Bedeutung |
|---|---|---|
| `NEUE_ENERGIE_PORTAL_USER` / `_PASSWORD` | ja | Partner-Login für den Tarifrechner (Preis + Provision) |
| `NEUE_ENERGIE_BASE_URI` / `NEUE_ENERGIE_API_KEY` | ja | external_api für Preisprüfung und Auftrag |
| `NEUE_ENERGIE_EXTERNAL_ID` | prüfen | Default `13120`. Klären, ob das unsere Partnernummer ist |
| `CASHBACK_NE_MODUS` | ja | `aus`, `test` (Default, testMode=1, kein Vertrag) oder `live` |
| `CASHBACK_SECRET` | ja | langer Zufallswert, verschlüsselt das Angebots-Token |
| `CASHBACK_MIN_PROVISION_EUR` | nein | Default 80 |
| `CASHBACK_BETRAG_EUR` | nein | Default 50 |
| `CASHBACK_CODES` | nein | Default `DRESDEN50`, mehrere mit Komma |
| `CASHBACK_NOTION_DATABASE_ID` | nein | wird sonst über die Notion-Suche gefunden bzw. angelegt |
| `CASHBACK_INTERN_MAIL` | nein | Default `box@plasma-energie.de` |
| `NEUE_ENERGIE_SALUTATION_FRAU` | prüfen | Default `salutation_mrs`, im Testlauf bestätigen |
| `NOTION_API_KEY`, `NOTION_PARENT_PAGE_ID`, `MS_*`, `TELEGRAM_*` | vorhanden | wie bei den Partner-Anfragen |
| `CASHBACK_DEMO=1` | nur lokal | Beispieltarife ohne Portal, in Produktion wirkungslos |

## Notion: Cashback-Wechsel

Ein Eintrag pro Auftrag. Wichtige Spalten: Vorgang, Status, MaLo fehlt, Selbst gekündigt, Lieferbeginn Wunsch, Code, Quelle, Eingang, Lieferbeginn, Cashback ausgezahlt am, Duplikat-Verdacht, IBAN, Kontoinhaber, Tarif, Provision € (intern), NE-Auftrags-ID, NE-Antwort.

Status: Neu → Test ok, manuell anlegen / An Neue Energie übermittelt / Manuell prüfen → Belieferung gestartet → Cashback ausgezahlt (oder Abgelehnt / storniert).

Auszahlung: Filter „Status = Belieferung gestartet“ und „Lieferbeginn älter als 0 Tage“, überweisen, Datum in „Cashback ausgezahlt am“, Status umstellen. Lieferbeginn und Belieferung pflegt bisher ein Mensch (siehe offene Punkte).

## Vor dem Livegang (Reihenfolge)

1. Env-Variablen in Vercel setzen, `CASHBACK_NE_MODUS=test`.
2. Preview-Deployment: einen echten Durchlauf mit eigener Adresse machen. Prüfen:
   - Kommt aus dem Portal ein Tarif? Feldnamen in `portalTarifLesen` gegen eine echte Antwort abgleichen (ID, Anbieter, Provision, Bonus, Laufzeit).
   - Stimmt die Portal-Tarif-ID mit der `tariffId` der external_api überein? Sonst schlägt die Preisprüfung fehl.
   - Ist die Provision aus dem Portal der Betrag **nach** Bonus (Laura-Lauf: 104 € ohne, 68 € mit 50 € Bonus)?
   - Antwortet `POST /contracts` mit testMode=1 ohne Fehler (Anrede Frau, Telefon, Geburtsdatum, MaLo, Kundennummer)?
   - Einmal mit „Ja, selbst gekündigt“ testen: akzeptiert die API `appointment_exact_date` mit Wunschdatum?
   - Landet der Vorgang in Notion, kommen beide Mails und Telegram an?
3. Rechtlich prüfen lassen: Bestelltext, Pflichtinfos vor dem Bestell-Button (Vertragszusammenfassung, AGB und Widerrufsbelehrung des Versorgers), Datenschutzerklärung um Neue Energie / Versorger als Empfänger ergänzen.
4. Ukrainisch und Arabisch gegenlesen lassen.
5. `CASHBACK_NE_MODUS=live` setzen.

## Offene Punkte

- Partner-Portal ist Scraping einer Oberfläche: bricht, wenn Neue Energie das Portal ändert, und muss mit deren Bedingungen vereinbar sein. Besser: Neue Energie nach einem API-Endpoint für Provision fragen.
- Auftragsstatus wird nicht automatisch abgefragt. `POST /statuses` der API ist noch nicht eingebaut; damit ließen sich „Belieferung gestartet“ und Lieferbeginn automatisch setzen.
- Versorger-AGB/Vertragszusammenfassung als Link vor der Bestellung: Quelle in Portal oder API klären.
