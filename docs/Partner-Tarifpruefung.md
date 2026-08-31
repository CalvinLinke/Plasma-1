# Partner-Anfragen — Tarifprüfung Neue Energie

Stand: 31.08.2026. Erkenntnisse aus der API-Doku (Excel) und lokalen Tests.

## Was die API kann

Basis: `https://service.neue-energie.de/external_api`  
Auth: `Authorization: Bearer {NEUE_ENERGIE_API_KEY}`

| Endpoint | Zweck | Im Code |
|---|---|---|
| `POST /tariffs` | Katalog: id, name, companyId, Strom/Gas, Privat/Gewerbe, Untertyp | `fetchTariffs()` |
| `POST /companies` | Versorgerliste | `fetchCompanies()` |
| `POST /contracts` | Preisprüfung (testMode) oder Auftrag | `checkTariffPrices()` |
| `POST /providers` | Vorversorger-Suche | noch nicht |
| `POST /scans` | PDF zum Auftrag | noch nicht |
| `POST /statuses` | Auftragsstatus | noch nicht |

**Kein Batch-Endpoint.** Preise = ein `POST /contracts` pro Tarif-ID, parallel in Gruppen (Default 5). `testMode=1` legt keinen Auftrag an.

**Keine Provision.** `/tariffs` liefert nur Stammdaten. Kein Provisions-Endpoint in der Excel-Doku. Vergütung sitzt im Partner-Login.

## Preis holen (`/contracts`)

Dummy-Preise mitschicken. Die API antwortet mit den korrekten Werten:

1. Paar: `Correct values (basePrice / workingPrice): [92.64, 34.42]`
2. Oder nacheinander: `Invalid basePrice, correct value: …` dann `Invalid workingPrice, correct value: …`

Privat = **Brutto**, Gewerbe = **Netto**. Grundpreis ist **€/Jahr**.

Bei manchen Versorgern (z. B. Süwag) steckt das **Messentgelt im Grundpreis** der API. Das Online-Tool druckt Grundpreis und Messgerät getrennt — Summe ist gleich.

Stufentarife (Süwag): Arbeitspreis hängt am **Jahresverbrauch**. 929 kWh → Stufe 0–999 (35,97 ct). 1000 kWh → Stufe 1.000–1.499 (34,42 ct). Abgerechnet wird später der **gemessene** Verbrauch, nicht die Antragsangabe.

Erstlaufzeit-Nachlässe (z. B. 1,00 ct bei Süwag) kommen **nicht** aus `/contracts`.

## Lieferantenwechsel vs. Neueinzug

Plasma-Fall ist **Wechsel**, nicht Neueinzug.

| Feld | Wert |
|---|---|
| `type` | `type_changing_provider` |
| `appointment` | `appointment_next_possible` |
| `clientNumber` | Vertragskonto aus der Rechnung |
| `currentProviderName` | **voller** Name, z. B. `Vattenfall Europe Sales GmbH` |

Nur „Vattenfall“ kann `Der gewünschte Tarif ist unter dieser PLZ nicht verfügbar` auslösen — auch wenn der Tarif in der PLZ lieferbar ist. Immer den Namen aus `/providers` bzw. der Rechnung verwenden.

Feste Tarif-ID `531` existiert nicht mehr. Katalog dynamisch laden.

## Typische API-Antworten

| Meldung | Bedeutung |
|---|---|
| Invalid basePrice / workingPrice | Normal — daraus Preise lesen |
| Tarif unter dieser PLZ nicht verfügbar | Regional nicht lieferbar **oder** Vorversorgername zu kurz |
| No marketLocation | Tarif braucht MaLo-ID |
| Neueinzug wird nicht akzeptiert | `type_move` statt Wechsel |
| No tariff | Unbekannte Tarif-ID |

## Pipeline heute

1. Mail → PDF-Text (`lib/invoice-parse.ts`, Vattenfall-Layout: Lieferstelle, Vertragskonto, Easy24 …)
2. Notion **Partner-Anfragen**
3. Optional ein Tarif via `checkTariffForLead` (noch eine ID, nicht der volle Katalog)

Nächster Workflow: Adresse + Verbrauch + Vorversorger (vollständig) + Wechsel → alle Strom-Privat-IDs durchreichen → nur lieferbare Preise merken → mit Ist-Kosten der Rechnung vergleichen.

## Environment

| Variable | Pflicht |
|---|---|
| `NEUE_ENERGIE_BASE_URI` | ja |
| `NEUE_ENERGIE_API_KEY` | ja |
| `NEUE_ENERGIE_TEST_MODE` | nein, Default `1` |
| `NEUE_ENERGIE_EXTERNAL_ID` | nein, Default `13120` |

Code: `lib/neue-energie.ts`. Katalog lokal: `npm run ne-tarife`.
