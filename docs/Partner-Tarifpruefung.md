# Partner-Anfragen — automatische Tarifprüfung (Neue Energie)

Nach jedem neuen oder aktualisierten Notion-Eintrag aus der Partner-Mail-Pipeline
prüft das System automatisch den **Angebotstarif** bei Neue Energie.

## Ablauf

1. Partner-E-Mail verarbeiten (Rechnung analysieren → Notion)
2. Adresse + Verbrauch aus Notion-Daten / Rechnungsanalyse
3. `POST {NEUE_ENERGIE_BASE_URI}/contracts` (Validierungs-Request wie im GFU-Formular)
4. Preise in Notion schreiben, Status → **Tarif geprüft** (bei Erfolg)

## Notion-Felder

| Spalte | Inhalt |
|---|---|
| Angebots-Grundpreis €/Jahr | NE-Angebot |
| Angebots-Arbeitspreis ct/kWh | NE-Angebot |
| Tarif-ID | z. B. `531` |
| Tarif-Status | OK / Fehlgeschlagen / Übersprungen |
| Tarif-Notizen | Fehler- oder Skip-Grund |
| Status | `Tarif geprüft` bei erfolgreicher Prüfung |

Rechnungswerte (alter Vertrag) bleiben in **Grundpreis €/Jahr** / **Arbeitspreis ct/kWh** unverändert.

## Environment (Vercel + `.env.local`)

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `NEUE_ENERGIE_BASE_URI` | ja | API-Basis-URL (wie GFU `NEUE_ENERGIE_BASE_URI`) |
| `NEUE_ENERGIE_API_KEY` | ja | Bearer-Token |
| `NEUE_ENERGIE_TEST_MODE` | nein | Default `1` (Testmodus wie GFU) |
| `NEUE_ENERGIE_TARIFF_ID` | nein | Default `531` (enviaM MEIN Strom best 24) |
| `NEUE_ENERGIE_EXTERNAL_ID` | nein | Default `13120` |
| `NEUE_ENERGIE_APPOINTMENT_DAYS` | nein | Lieferbeginn = heute + N Tage (Default 14) |
| `NEUE_ENERGIE_DEFAULT_CONSUMPTION_KWH` | nein | Fallback-Verbrauch ohne Rechnung (Default 2500) |

Ohne NE-Credentials: Tarifprüfung **Übersprungen**, Lead wird trotzdem angelegt.

## Manuell testen

Dev-Server + Laura-Nachlauf:

```bash
curl -s 'http://localhost:3000/api/process-partner-mails?lookbackMinutes=5000&updateExisting=1'
```

Dry-Run (ohne Notion-Schreiben):

```bash
curl -s 'http://localhost:3000/api/process-partner-mails?lookbackMinutes=5000&dryRun=1'
```

## Referenz

Logik portiert aus [esveo/gfu-website](https://github.com/esveo/gfu-website):
`src/app/validateAdress.tsx`, `src/app/submitHelpers.ts`
