# Partner-Anfragen — Telegram-Benachrichtigung

Bei jeder **neuen** Partner-Anfrage in Notion sendet die Pipeline eine Nachricht in eine Telegram-Gruppe.

## Einrichtung (einmalig, ~10 Min.)

### 1. Bot anlegen

1. In Telegram **@BotFather** öffnen
2. `/newbot` → Name z. B. `Plasma Partner Leads`
3. Bot-Token notieren (Format `123456789:ABC…`)

### 2. Bot zur Gruppe hinzufügen

1. Telegram-Gruppe für das Team anlegen oder bestehende nutzen
2. Bot als Mitglied hinzufügen
3. Optional: Bot zum Admin machen (damit er schreiben darf)

### 3. Chat-ID ermitteln

1. In der Gruppe eine Nachricht schreiben (z. B. „test“)
2. Im Browser öffnen:

   ```
   https://api.telegram.org/bot<DEIN_TOKEN>/getUpdates
   ```

3. In der JSON-Antwort suchen: `"chat":{"id":-100xxxxxxxxxx`
4. Diese **chat_id** notieren (Gruppen-IDs sind negativ)

### 4. Environment setzen

**Lokal** (`.env.local`) und **Vercel** (Production):

| Variable | Wert |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token von BotFather |
| `TELEGRAM_CHAT_ID` | Gruppen-chat_id (z. B. `-1001234567890`) |

Optional:

| Variable | Wert |
|---|---|
| `TELEGRAM_NOTIFY_ON_UPDATE` | `1` — auch bei `updateExisting`-Läufen benachrichtigen (Default: aus) |

Ohne Variablen: Pipeline läuft normal, Telegram wird übersprungen.

## Nachrichteninhalt

- Name, Partner, E-Mail, Telefon, PLZ/Ort
- Rechnungsanalyse-Status
- Tarifprüfung (falls konfiguriert)
- Link zu Notion

## Test

Dev-Server läuft, dann Dry-Run (kein Telegram):

```bash
curl -s 'http://localhost:3000/api/process-partner-mails?dryRun=1'
```

Echten Telegram-Test: neue Test-Anfrage über `/tonym` oder manuell `notifyPartnerLeadTelegram` — am einfachsten nach erstem echten Lead mit gesetzten Env-Vars.

## Code

- [`lib/telegram-notify.ts`](../lib/telegram-notify.ts)
- Aufruf in [`lib/process-partner-mails.ts`](../lib/process-partner-mails.ts)
