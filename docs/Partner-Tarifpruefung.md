# Partner-Anfragen — Tarifprüfung Neue Energie

Stand: 02.09.2026. API-Doku (Excel), lokale Tests, Partner-Portal (Laura-Lauf).

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

## Partner-Portal (Vergleichsrechner)

Der Rechner hinter dem Partner-Login liefert **Provision und Bonus**, die `external_api` nicht hat. Skill: `.claude/skills/neue-energie-portal/`. Code: `lib/neue-energie-portal.ts`. Referenzlauf: `npm run ne-portal:laura` → `data/ne-portal-laura/` (gitignoriert).

Nur lesen. Kein `save-contract`, `pass-new`, `pass-draft`.

### Login

1. `GET /` — CSRF `_csrf_token` aus dem Login-Formular, Cookies mitnehmen.
2. `POST /login_check` — `_username`, `_password`, `_csrf_token`, `_submit=OK`.
3. Erfolg: HTML enthält `/logout`, `Abmelden` oder `active-user-wrapper`. Die URL darf `/` bleiben — nicht auf `/partner-area/` in der Adresse warten.
4. Danach `GET /partner-area/calculator/` (SPA, `#calculator-app`).

### Rechner-Calls (wie die SPA)

| Call | Details |
|---|---|
| `GET /partner-area/calculator/load-models?appCase=CASE_CREATE&copied=false` | AJAX (`X-Requested-With`), JSON. Ohne `appCase` → 500. Liefert `calculatorModel`, `apiServiceToken` (maskieren). `contractId` weglassen. |
| `POST /partner-area/calculator/tariffs` | Body wie jQuery: `calculator[zip]=…` via `toJqueryForm({ calculator: submit })`. `submit` aus `buildCalculatorSubmit` (Strom: `energyType=electro`, `electroType=electro_type_normal`, `clientType=client_type_private`). |
| Antwort | JSON `{ tariffs: "<base64>" }` → `decodePortalTariffs`. Felder u. a. `workingPrice`, `basePrice` (€/Jahr), `bonus`, `bonusLoyalty`, `bonusInstant`, `provision.cost`. |

`GET https://service.neue-energie.de/external/calculators/tariffs` (SPA-Merge) lieferte mit Portal-Token **422 No access** — nicht als Quelle nutzen.

### Verifiziert (Laura, 1000 kWh, 01067 Dresden, Wechsel)

34 Tarife. Süwag Naturstrom Ideal: Arbeitspreis 34,42 ct, Grundpreis 92,64 €/Jahr (wie API). Ohne Bonus Provision **104 €**; mit Bonus 50 Provision **68 €**, `bonus=50`.

| Variable | Pflicht |
|---|---|
| `NEUE_ENERGIE_PORTAL_USER` | ja, Partner-Login |
| `NEUE_ENERGIE_PORTAL_PASSWORD` | ja |
| `NEUE_ENERGIE_PORTAL_BASE_URI` | nein, Default `https://www.neue-energie.de` |

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
| `marketLocation` / `marketLocationId` | MaLo-ID, z. B. `10062705754` — ohne sie lehnen mehrere Versorger ab |

Nur „Vattenfall“ kann `Der gewünschte Tarif ist unter dieser PLZ nicht verfügbar` auslösen — auch wenn der Tarif in der PLZ lieferbar ist. Immer den Namen aus `/providers` bzw. der Rechnung verwenden.

Feste Tarif-ID `531` existiert nicht mehr. Katalog dynamisch laden.

## Typische API-Antworten

| Meldung | Bedeutung |
|---|---|
| Invalid basePrice / workingPrice | Normal — daraus Preise lesen |
| Tarif unter dieser PLZ nicht verfügbar | Regional nicht lieferbar **oder** Vorversorgername zu kurz |
| No marketLocation | Tarif braucht MaLo-ID — `marketLocation` **und** `marketLocationId` setzen (11 Ziffern aus der Rechnung) |
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
| `NEUE_ENERGIE_PORTAL_USER` | für Portal-Bot |
| `NEUE_ENERGIE_PORTAL_PASSWORD` | für Portal-Bot |

Code: `lib/neue-energie.ts`, `lib/neue-energie-portal.ts`. Katalog: `npm run ne-tarife`. Portal-Capture: `npm run ne-portal:laura`.
