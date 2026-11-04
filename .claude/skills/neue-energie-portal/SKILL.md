---
name: neue-energie-portal
description: Bedient das Neue-Energie-Partner-Portal (Login, Tarifrechner) fuer Preise plus Provision und Bonus. Nutzen bei Portal-Bot, Partner-Login, Tarifrechner, Provision, Treuebonus, NE-Vergleich oder wenn die external_api keine Verguetung liefert.
---

# Neue Energie — Partner-Portal

Fakten und Feldlisten: [`docs/Partner-Tarifpruefung.md`](../../../docs/Partner-Tarifpruefung.md).
Code: `lib/neue-energie-portal.ts`. API-Preise ohne Provision: `lib/neue-energie.ts`.

## Wann was

| Ziel | Quelle |
|---|---|
| Katalog, Grundpreis, Arbeitspreis | `external_api` (`checkTariffPrices`) |
| Provision, Bonus, Nachlass wie im Rechner | Partner-Portal (`loginNeueEnergiePortal` + `POST …/calculator/tariffs`) |

## Ablauf

1. `NEUE_ENERGIE_PORTAL_USER` und `NEUE_ENERGIE_PORTAL_PASSWORD` in `.env.local` (nicht der API-Key). Fehlen sie: abbrechen und danach fragen.
2. Referenzlauf: `npm run ne-portal:laura` — schreibt nach `data/ne-portal-laura/` (gitignoriert).
3. Login: CSRF von `/`, dann `POST /login_check`. Erfolg ist **Abmelden** / `active-user-wrapper`, auch wenn die URL `/` bleibt.
4. Modelle: `GET /partner-area/calculator/load-models?appCase=CASE_CREATE&copied=false` als AJAX-JSON.
5. Tarife: `POST /partner-area/calculator/tariffs` mit `toJqueryForm({ calculator: submit })`. Antwort `tariffs` ist Base64-JSON — `decodePortalTariffs`.
6. Tokens in Dumps mit `redactSecrets` maskieren. Session-Cookies nicht committen.

Done wenn die Decodierung Tarife mit `provision.cost`, `workingPrice`, `basePrice` und `bonus` liefert — oder der Fehler mit Status, URL und ohne Passwort dokumentiert ist.

## Guardrails

Lesen, nicht beauftragen. Kein `save-contract`, `pass-new`, `pass-draft`. Kein Playwright, solange die Session-POSTs reichen.
